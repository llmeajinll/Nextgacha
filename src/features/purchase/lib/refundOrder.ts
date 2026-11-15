import { mongodbClient, orderColl, productColl, userColl } from '@/shared/api/mongodb';
import { recordSystemError } from '@/shared/api/recordSystemError';
import { koreaTime } from '@/shared/lib/koreaTime';
import { subtractKeep } from './orderPolicy';
import { cancelOrderPayment } from './toss';

const CHECKING = '상품 확인중';

// 상품 확인중 주문 취소 → Toss 결제 취소 + 재고 복구 + 배송중(keep) 차감 + 사용 포인트 반환
// 관리자 거절(postCheckToSending 'refund')과 구매자 취소(protected/postCancelOrder)가 같이 쓴다.
// email을 주면 그 사용자의 주문만 찾는다 (구매자 취소: 남의 주문 차단)
export async function refundOrder(
  orderId: string,
  reason: string,
  { email, by }: { email?: string; by: 'admin' | 'user' },
) {
  const filter = { orderId, status: CHECKING, ...(email && { email }) };
  const order = await orderColl.findOne(filter);
  if (!order) return { ok: false as const, status: 409, message: '취소할 수 없는 주문입니다.' };

  // 1. 돈부터 돌려준다 (실패하면 DB는 그대로)
  try {
    await cancelOrderPayment(order, reason, by === 'admin' ? 'refund' : 'user-cancel');
  } catch (err) {
    console.error('Toss 결제 취소 실패:', orderId, err instanceof Error ? err.message : err);
    return { ok: false as const, status: 502, message: '결제 취소에 실패했습니다.' };
  }

  // 2. DB 정리. 여기서 실패하면 결제만 취소된 상태 → 관리자 수동 처리용으로 기록 + 카톡
  const session = mongodbClient.startSession();
  try {
    await session.withTransaction(async () => {
      const claimed = await orderColl.findOneAndUpdate(
        filter,
        {
          $set: {
            status: '환불',
            reason,
            refundedDate: koreaTime(),
            ...(by === 'user' && { canceledBy: 'user' }),
          },
        },
        { session },
      );
      if (!claimed) throw new Error('이미 처리된 주문입니다.');

      await productColl.bulkWrite(
        order.list.flatMap((line) =>
          line.product.map((p) => ({
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
    return { ok: true as const, order };
  } catch (err) {
    console.error('환불 DB 처리 실패:', orderId);
    await recordSystemError(
      `[환불 DB 처리 실패 - 결제는 취소됨] orderId=${orderId} error=${String(err)}`,
      by === 'admin' ? '/api/postCheckToSending' : '/api/protected/postCancelOrder',
      { notify: true },
    );
    return {
      ok: false as const,
      status: 500,
      message: '결제는 취소되었지만 주문 정리에 실패했습니다. 관리자가 확인 후 처리합니다.',
    };
  } finally {
    await session.endSession();
  }
}
