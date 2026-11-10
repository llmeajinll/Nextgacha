import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { errorColl, mongodbClient } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { validateStock } from '@/features/purchase/lib/validateStock';
import { verifyOrder } from '@/features/purchase/lib/verifyOrder';
import { reduceStock } from '@/features/purchase/lib/reduceStock';
import { reducePoint } from '@/features/purchase/lib/reducePoint';
import { addOrder } from '@/features/purchase/lib/addOrder';
import { resetCart } from '@/features/purchase/lib/resetCart';
import {
  cancelTossPayment,
  confirmTossPayment,
} from '@/features/purchase/lib/toss';


export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  const name = session?.user?.name;

  if (!email) {
    return NextResponse.json(
      { message: '로그인이 되어있지 않습니다.', ok: false },
      { status: 401 },
    );
  }

  const { paymentKey, orderId, amount, list, address, usedPoint } =
    await req.json();

  // 다른 계정 중복 구매 표시용 신호. 쿠키는 사용자가 바꿀 수 있으므로 UUID 형식만 받는다
  const did = (await cookies()).get('did')?.value;
  const deviceId = did && /^[0-9a-f-]{36}$/.test(did) ? did : null;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim().slice(0, 45) || null;

  // 1. [최종 재고 확인] 부족한 상품은 장바구니에서도 정리
  const stock = await validateStock(list);
  if (stock.isAvailable === false) {
    return NextResponse.json(
      { message: stock.message, ok: false },
      { status: 400 },
    );
  }

  // 2. [금액/포인트/보유 한도 검증] 클라이언트 값을 믿지 않고 DB 기준으로 재계산
  const verified = await verifyOrder({
    email,
    list,
    amount: Number(amount),
    usedPoint: Number(usedPoint ?? 0),
  });
  if (!verified.ok) {
    return NextResponse.json(
      { message: verified.message, ok: false },
      { status: 400 },
    );
  }

  // 3. [Toss 승인 API 호출] 여기서 실제로 돈이 정산됩니다.
  const data = await confirmTossPayment({
    paymentKey,
    orderId,
    amount: Number(amount),
  });

  if (data.status !== 'DONE') {
    console.error('Toss 승인 실패:', data);
    return NextResponse.json(
      { message: data.message ?? '결제 승인에 실패했습니다.', ok: false },
      { status: 400 },
    );
  }

  // 4. [최종 처리] 하나라도 실패하면 throw → 전체 롤백
  const mongodbSession = mongodbClient.startSession();
  try {
    await mongodbSession.withTransaction(async () => {
      await reducePoint({
        usedPoint: Number(usedPoint ?? 0),
        email,
        list: verified.orderList,
        mongodbSession,
      });
      await reduceStock({ list: verified.orderList, mongodbSession });
      await addOrder({
        orderId,
        list: verified.orderList,
        amount: Number(amount),
        email,
        name: name ?? '',
        mongodbSession,
        address,
        addPoint: verified.addPoint,
        usedPoint: Number(usedPoint ?? 0),
        deviceId,
        ip,
      });
      await resetCart({ email, list: verified.orderList, mongodbSession });
    });
  } catch (err) {
    console.error('트랜잭션 실패! 모든 작업이 취소되었습니다:', err);
    // 돈은 이미 빠져나갔으므로 결제 취소
    await cancelPayment(paymentKey, orderId, err);
    return NextResponse.json(
      {
        message:
          err instanceof Error
            ? `${err.message} 결제가 취소되었습니다.`
            : '주문 처리 중 오류가 발생하여 결제가 취소되었습니다.',
        ok: false,
      },
      { status: 400 },
    );
  } finally {
    await mongodbSession.endSession();
  }

  return NextResponse.json(
    { ok: true, data: { orderId, list: verified.orderList, amount, address } },
    { status: 201 },
  );
}

async function cancelPayment(paymentKey: string, orderId: string, cause: unknown) {
  try {
    await cancelTossPayment(paymentKey, '주문 처리 실패');
  } catch (cancelErr) {
    // 결제는 됐는데 주문도 취소도 안 된 상태 → 관리자 수동 처리용으로 기록
    console.error('결제 취소 실패:', cancelErr);
    await errorColl
      .insertOne({
        textareaValue: `[결제 취소 실패] orderId=${orderId} paymentKey=${paymentKey} cause=${String(
          cause,
        )} cancelError=${String(cancelErr)}`,
        pathname: '/api/postPaymentsConfirm',
        type: 'system',
        status: '접수',
        created_at: koreaTime(),
      })
      .catch((e) => console.error('에러 기록 실패:', e));
  }
}
