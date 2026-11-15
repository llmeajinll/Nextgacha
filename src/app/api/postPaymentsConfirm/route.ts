import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mongodbClient, userColl } from '@/shared/api/mongodb';
import { recordSystemError } from '@/shared/api/recordSystemError';
import { clientSignals } from '@/shared/lib/clientSignals';
import { validateStock } from '@/features/purchase/lib/validateStock';
import { verifyOrder } from '@/features/purchase/lib/verifyOrder';
import { reduceStock } from '@/features/purchase/lib/reduceStock';
import { reducePoint } from '@/features/purchase/lib/reducePoint';
import { addOrder } from '@/features/purchase/lib/addOrder';
import { resetCart } from '@/features/purchase/lib/resetCart';
import {
  cancelTossPayment,
  confirmTossPayment,
  getTossPaymentByOrderId,
} from '@/features/purchase/lib/toss';
import { isPaymentDisabled, PAYMENTS_DISABLED_MESSAGE } from '@/features/purchase/lib/paymentSwitch';

const PATH = '/api/postPaymentsConfirm';
const UNKNOWN_MESSAGE = '결제가 확인되지 않았습니다. 주문 내역을 확인해주세요.';


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

  if (isPaymentDisabled()) {
    return NextResponse.json({ message: PAYMENTS_DISABLED_MESSAGE, ok: false }, { status: 503 });
  }

  const { paymentKey, orderId, amount, list, address, usedPoint } =
    await req.json().catch(() => ({}));
  if (
    typeof paymentKey !== 'string' || paymentKey.length > 200 ||
    typeof orderId !== 'string' || orderId.length > 64 ||
    typeof address !== 'string' || address.length > 300
  ) {
    return NextResponse.json({ message: '결제 정보가 올바르지 않습니다.', ok: false }, { status: 400 });
  }

  const lastSeen = await clientSignals();
  const { deviceId, ip } = lastSeen;

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
  let data;
  try {
    data = await confirmTossPayment({ paymentKey, orderId, amount: Number(amount) });
  } catch (err) {
    // 타임아웃·네트워크 오류: 승인됐는지 모름 → 조회해서 승인됐으면 취소 (payments.md "Toss 요청 타임아웃")
    console.error('Toss 승인 응답 없음:', orderId, err instanceof Error ? err.name : err);
    await cancelIfApproved(orderId, err);
    return NextResponse.json({ message: UNKNOWN_MESSAGE, ok: false }, { status: 504 });
  }

  if (data.status !== 'DONE') {
    console.error('Toss 승인 실패:', orderId, data.code);
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
        paymentKey,
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

  // 관리자 회원 상세의 최근 IP·기기. 결제는 끝났으므로 실패해도 주문은 성공 처리
  await userColl
    .updateOne({ email }, { $set: { lastSeen } })
    .catch((e) => console.error('lastSeen 저장 실패', e instanceof Error ? e.message : e));

  return NextResponse.json(
    { ok: true, data: { orderId, list: verified.orderList, amount, address } },
    { status: 201 },
  );
}

async function cancelPayment(paymentKey: string, orderId: string, cause: unknown) {
  try {
    await cancelTossPayment(paymentKey, '주문 처리 실패', { orderId, reason: 'order-failed' });
  } catch (cancelErr) {
    // 결제는 됐는데 주문도 취소도 안 된 상태 → 관리자 수동 처리용으로 기록 + 카톡
    console.error('결제 취소 실패:', orderId);
    await recordSystemError(
      `[결제 취소 실패] orderId=${orderId} paymentKey=${paymentKey} cause=${String(
        cause,
      )} cancelError=${String(cancelErr)}`,
      PATH,
      { notify: true },
    );
  }
}

// 승인 응답을 못 받았을 때. 조회도 실패하면 기록만 남기고 결제 대사 웹훅(/api/webhooks/toss)에 맡긴다
async function cancelIfApproved(orderId: string, cause: unknown) {
  try {
    const payment = await getTossPaymentByOrderId(orderId);
    if (payment?.status === 'DONE') await cancelPayment(payment.paymentKey, orderId, cause);
  } catch (lookupErr) {
    await recordSystemError(
      `[결제 확인 불가] orderId=${orderId} cause=${String(cause)} lookupError=${String(lookupErr)}`,
      PATH,
      { notify: true },
    );
  }
}
