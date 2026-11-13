import { cartColl } from '@/shared/api/mongodb';
import { ClientSession } from 'mongodb';

// 구매한 옵션만 장바구니에서 뺀다. 같은 상품(num)의 고르지 않은 옵션은 남기고, 옵션이 다 빠진 상품 묶음만 지운다.
// 트랜잭션 안에서 실행되므로 catch하지 않는다 (실패하면 throw → 결제 취소)
export async function resetCart({
  email,
  list,
  mongodbSession,
}: {
  email: string;
  list: { num: number; product: { name: string }[] }[];
  mongodbSession: ClientSession;
}) {
  for (const line of list) {
    await cartColl.updateOne(
      { user: email, 'cart.num': line.num },
      { $pull: { 'cart.$.product': { name: { $in: line.product.map((p) => p.name) } } } } as any,
      { session: mongodbSession },
    );
  }
  await cartColl.updateOne(
    { user: email },
    { $pull: { cart: { product: { $size: 0 } } } } as any,
    { session: mongodbSession },
  );
}
