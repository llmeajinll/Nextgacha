import { ObjectId } from 'mongodb';
import { orderColl } from '@/shared/api/mongodb';

// 관리자 주문 목록 (커서 페이지네이션, 10개씩). lastId는 호출 측에서 ObjectId.isValid 검증
export async function findOrdersByStatus(status: string, lastId = '') {
  const query: Record<string, any> = { status };
  if (lastId) query._id = { $lt: new ObjectId(lastId) };

  const data = await orderColl.find(query).sort({ _id: -1 }).limit(10).toArray();
  const result = data.map((item) => ({ ...item, check: false }));

  // 클라이언트 컴포넌트/JSON으로 넘기므로 ObjectId → string
  return JSON.parse(
    JSON.stringify({ result, nextCursor: result[result.length - 1]?._id ?? '' }),
  ) as { result: any[]; nextCursor: string };
}
