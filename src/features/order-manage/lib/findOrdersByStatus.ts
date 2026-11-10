import { orderColl } from '@/shared/api/mongodb';
import { ORDER_PAGE_SIZE, ORDER_STATUSES, type AdminOrder, type OrderStatus } from '../model/status';
import { findSuspects, type OrderSignals } from './findSuspects';

// 관리자 주문 목록 (번호 페이지, 20개씩). 상품 확인중은 먼저 들어온 주문부터 보내도록 오래된 순, 나머지는 최근 순
export async function findOrdersByStatus(status: OrderStatus, page = 1) {
  const query = { status };
  const [data, total] = await Promise.all([
    orderColl
      .find(query)
      .sort({ _id: status === '상품 확인중' ? 1 : -1 })
      .skip((Math.max(page, 1) - 1) * ORDER_PAGE_SIZE)
      .limit(ORDER_PAGE_SIZE)
      .toArray(),
    orderColl.countDocuments(query),
  ]);

  // 상품 확인중(보내기 전)에만 다른 계정 중복 구매를 표시. 한도와 같은 기준으로 아직 보유 중인 주문(확인중·배송중)과 비교
  // ponytail: 진행 중 주문 전체를 읽어서 메모리에서 비교, 진행 중 주문이 수천 건이 되면 deviceId/ip/address 인덱스 + $or 쿼리로
  if (status === '상품 확인중') {
    const active = (await orderColl
      .find(
        { status: { $in: ['상품 확인중', '배송중'] } },
        { projection: { _id: 0, orderId: 1, email: 1, deviceId: 1, ip: 1, address: 1, 'list.num': 1 } },
      )
      .toArray()) as unknown as OrderSignals[];
    for (const order of data) order.suspects = findSuspects(order as unknown as OrderSignals, active);
  }

  // 클라이언트 컴포넌트/JSON으로 넘기므로 ObjectId → string
  return JSON.parse(JSON.stringify({ result: data, total })) as { result: AdminOrder[]; total: number };
}

// 상태 탭 옆 건수
export async function countOrdersByStatus(): Promise<Record<OrderStatus, number>> {
  const rows = await orderColl
    .aggregate<{ _id: string; n: number }>([
      { $match: { status: { $in: ORDER_STATUSES.map((s) => s.status) } } },
      { $group: { _id: '$status', n: { $sum: 1 } } },
    ])
    .toArray();
  return Object.fromEntries(
    ORDER_STATUSES.map((s) => [s.status, rows.find((r) => r._id === s.status)?.n ?? 0]),
  ) as Record<OrderStatus, number>;
}
