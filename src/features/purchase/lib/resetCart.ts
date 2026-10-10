import { cartColl } from '@/shared/api/mongodb';
import { ClientSession } from 'mongodb';

// 구매한 상품(num 그룹)을 장바구니에서 제거
export async function resetCart({
  email,
  list,
  mongodbSession,
}: {
  email: string;
  list: { num: number }[];
  mongodbSession: ClientSession;
}) {
  const num = list.map((val) => val.num);
  await cartColl.updateOne(
    { user: email },
    { $pull: { cart: { num: { $in: num } } } } as any,
    { session: mongodbSession },
  );
}
