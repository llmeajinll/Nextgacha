import { NextResponse } from 'next/server';
import { orderColl, mongodbClient, userColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { subtractKeep } from '@/features/purchase/lib/orderPolicy';

// 배송중 → 배송 완료: 적립금 지급 + 배송중(keep) 수량 차감을 한 트랜잭션으로.
// email/addPoint/list는 클라이언트 값이 아닌 DB 주문 문서 기준.
// status: '배송중' 조건 덕분에 같은 주문을 두 번 눌러도 포인트가 중복 지급되지 않는다.
async function finishOrder(orderId: string) {
  const session = mongodbClient.startSession();
  let finished = false;
  try {
    await session.withTransaction(async () => {
      finished = false;
      const order = await orderColl.findOneAndUpdate(
        { orderId, status: '배송중' },
        { $set: { status: '배송 완료', arrivedDate: koreaTime() } },
        { session },
      );
      if (!order) return;

      const user = await userColl.findOne(
        { email: order.email },
        { session, projection: { keep: 1 } },
      );
      await userColl.updateOne(
        { email: order.email },
        {
          $inc: { point: order.addPoint ?? 0 },
          $set: { keep: subtractKeep(user?.keep ?? [], order.list) },
        },
        { session },
      );
      finished = true;
    });
  } finally {
    await session.endSession();
  }
  return finished;
}

export async function POST(req: Request) {
  const data = await req.json();
  const { send } = data;

  // one: { orderId }, many: { orders: [{ orderId }] } — 나머지 필드는 무시
  const orderIds: string[] =
    send === 'one'
      ? [data.orderId]
      : send === 'many'
        ? (data.orders ?? []).map((o: any) => o.orderId)
        : [];

  if (orderIds.length === 0 || orderIds.some((id) => typeof id !== 'string')) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }

  let finishedCount = 0;
  const failed: string[] = [];
  for (const orderId of orderIds) {
    try {
      if (await finishOrder(orderId)) finishedCount++;
    } catch (err) {
      console.error(`배송 완료 처리 실패 (${orderId}):`, err);
      failed.push(orderId);
    }
  }

  return NextResponse.json(
    { ok: failed.length === 0, result: { finishedCount, failed } },
    { status: failed.length === 0 ? 200 : 500 },
  );
}
