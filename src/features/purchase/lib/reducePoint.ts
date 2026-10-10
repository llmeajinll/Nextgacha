import { userColl } from '@/shared/api/mongodb';
import { ClientSession } from 'mongodb';
import { mergeKeep, overCapItem, OrderLine } from './orderPolicy';

// 포인트 차감 + 배송중(keep)에 주문 수량 추가.
// 트랜잭션 안에서 user 문서를 읽고 쓰므로, 동시 결제는 write conflict로 직렬화된다.
// 실패 시 throw → withTransaction 전체 롤백
export async function reducePoint({
  usedPoint,
  email,
  list,
  mongodbSession,
}: {
  usedPoint: number;
  email: string;
  list: OrderLine[];
  mongodbSession: ClientSession;
}) {
  const user = await userColl.findOne(
    { email },
    { session: mongodbSession, projection: { point: 1, keep: 1 } },
  );
  if (!user) throw new Error('유저를 찾을 수 없습니다.');
  if ((user.point ?? 0) < usedPoint) throw new Error('포인트가 부족합니다.');

  const keep = mergeKeep(user.keep ?? [], list);
  const overItem = overCapItem(keep);
  if (overItem) throw new Error(`${overItem}의 보유 한도를 초과했습니다.`);

  await userColl.updateOne(
    { email },
    { $inc: { point: -usedPoint }, $set: { keep } },
    { session: mongodbSession },
  );
}
