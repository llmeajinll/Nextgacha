import { NextResponse } from 'next/server';
import {
  errorColl,
  mongodbClient,
  orderColl,
  productColl,
  userColl,
} from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { subtractKeep } from '@/features/purchase/lib/orderPolicy';
import { cancelTossPaymentByOrderId } from '@/features/purchase/lib/toss';

const CHECKING = '상품 확인중';

// Mongo 필터·$set에 넣기 전에 문자열인지, 길이가 맞는지 확인 (객체면 연산자로 해석됨)
const str = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

const parseShip = (o: any) => {
  const orderId = str(o?.orderId, 100);
  const courier = str(o?.courier, 30);
  const invoice = str(o?.invoice, 30);
  return orderId && courier && invoice ? { orderId, courier, invoice } : null;
};

// 상품 확인중 주문 거절 → Toss 결제 취소 + 재고 복구 + 배송중(keep) 차감 + 사용 포인트 반환
async function refundOrder(orderId: string, reason: string) {
  const order = await orderColl.findOne({ orderId, status: CHECKING });
  if (!order) return { ok: false, message: '환불할 수 없는 주문입니다.' };

  // 1. 돈부터 돌려준다 (실패하면 DB는 그대로)
  try {
    await cancelTossPaymentByOrderId(orderId, reason);
  } catch (err) {
    console.error('Toss 결제 취소 실패:', err);
    return { ok: false, message: '결제 취소에 실패했습니다.' };
  }

  // 2. DB 정리. 여기서 실패하면 결제만 취소된 상태 → 관리자 수동 처리용으로 기록
  const session = mongodbClient.startSession();
  try {
    await session.withTransaction(async () => {
      const claimed = await orderColl.findOneAndUpdate(
        { orderId, status: CHECKING },
        { $set: { status: '환불', reason, refundedDate: koreaTime() } },
        { session },
      );
      if (!claimed) throw new Error('이미 처리된 주문입니다.');

      await productColl.bulkWrite(
        order.list.flatMap((line: any) =>
          line.product.map((p: any) => ({
            updateOne: {
              filter: { num: line.num, 'list.name': p.name },
              update: { $inc: { 'list.$.count': p.count } },
            },
          })),
        ),
        { session },
      );

      const user = await userColl.findOne(
        { email: order.email },
        { session, projection: { keep: 1 } },
      );
      await userColl.updateOne(
        { email: order.email },
        {
          // usedPoint는 이번 변경 이후 주문부터 저장됨 (이전 주문은 0으로 간주)
          $inc: { point: order.usedPoint ?? 0 },
          $set: { keep: subtractKeep(user?.keep ?? [], order.list) },
        },
        { session },
      );
    });
    return { ok: true };
  } catch (err) {
    console.error('환불 DB 처리 실패:', err);
    await errorColl
      .insertOne({
        textareaValue: `[환불 DB 처리 실패 - 결제는 취소됨] orderId=${orderId} error=${String(err)}`,
        pathname: '/api/postCheckToSending',
        type: 'system',
        status: '접수',
        created_at: koreaTime(),
      })
      .catch((e) => console.error('에러 기록 실패:', e));
    return {
      ok: false,
      message: '결제는 취소되었지만 주문 정리에 실패했습니다. 에러 페이지를 확인해주세요.',
    };
  } finally {
    await session.endSession();
  }
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const { send } = data;
  const invalid = () => NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });

  // 한개
  if (send === 'one') {
    const ship = parseShip(data);
    if (!ship) return invalid();
    const { orderId, courier, invoice } = ship;
    const result = await orderColl.updateOne(
      { orderId, status: CHECKING },
      { $set: { courier, invoice, status: '배송중' } },
    );
    return NextResponse.json(
      { ok: result.modifiedCount === 1, result },
      { status: result.modifiedCount === 1 ? 200 : 400 },
    );
  }
  // 여러개
  else if (send === 'many') {
    const orders = Array.isArray(data.orders) && data.orders.length <= 100 ? data.orders.map(parseShip) : [];
    if (orders.length === 0 || orders.some((o: unknown) => !o)) return invalid();
    try {
      const result = await orderColl.bulkWrite(
        orders.map((order: any) => ({
          updateOne: {
            filter: { orderId: order.orderId, status: CHECKING },
            update: {
              $set: {
                courier: order.courier,
                invoice: order.invoice,
                status: '배송중',
              },
            },
          },
        })),
      );
      return NextResponse.json({ ok: true, modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
      console.error('주문 업데이트 중 에러 발생:', error);
      return NextResponse.json({ ok: false, result: {} }, { status: 400 });
    }
  }
  // 환불
  else if (send === 'refund') {
    const orderId = str(data.orderId, 100);
    // 고객에게 보이는 환불 사유 (화면에서도 10자 이상 받음)
    const reason = str(data.reason, 200);
    if (!orderId || !reason || reason.length < 10) return invalid();
    const result = await refundOrder(orderId, reason);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({ ok: false, message: 'invalid send' }, { status: 400 });
}
