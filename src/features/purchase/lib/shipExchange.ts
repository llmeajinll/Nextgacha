import { mongodbClient, orderColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { reduceStock } from './reduceStock';

// 교환 요청 → 교환 완료 (docs/policies/refunds.md "배송 후 반품/교환"). 같은 상품을 다시 보내므로 주문 수량만큼 재고를 뺀다.
// 재고가 모자라거나 이미 처리된 주문이면 throw → 상태 변경도 롤백 (관리자 postExchange가 사용)
// ponytail: 주문 전체를 다시 보낸다. 일부 상품만 교환하려면 상품·수량을 받아 그만큼만 차감
export async function shipExchange(orderId: string) {
  const session = mongodbClient.startSession();
  try {
    return await session.withTransaction(async () => {
      const claimed = await orderColl.findOneAndUpdate(
        { orderId, status: '교환 요청' },
        { $set: { status: '교환 완료', exchangedDate: koreaTime() } },
        { session },
      );
      if (!claimed) throw new Error('이미 처리된 주문이에요.');
      await reduceStock({ list: claimed.list, mongodbSession: session });
      return claimed;
    });
  } finally {
    await session.endSession();
  }
}
