import { cartColl, productColl, userColl } from '@/shared/api/mongodb';
import {
  isValidOrderList,
  MAX_PER_ITEM,
  mergeKeep,
  overCapItem,
} from './orderPolicy';

// 장바구니에 additions를 더해도 재고/보유 한도(장바구니 + 배송중 ≤ 5)를 넘지 않는지 검사.
// 문제가 있으면 메시지, 없으면 null.
// ponytail: 검사→쓰기 사이 경쟁은 막지 않음. 최종 방어는 결제 트랜잭션(reducePoint/reduceStock)
export async function checkCartLimit(
  email: string,
  num: number,
  additions: { name: string; count: number }[],
): Promise<string | null> {
  const addLine = { num, product: additions };
  if (!isValidOrderList([addLine])) return '요청 값이 올바르지 않습니다.';

  const [product, cartDoc, user] = await Promise.all([
    productColl.findOne({ num }, { projection: { list: 1 } }),
    cartColl.findOne({ user: email }, { projection: { cart: 1 } }),
    userColl.findOne({ email }, { projection: { keep: 1 } }),
  ]);
  if (!product) return '상품을 찾을 수 없습니다.';

  const cartLine = (cartDoc?.cart ?? []).find((c: any) => c.num === num) ?? {
    num,
    product: [],
  };
  const cartAfter = mergeKeep([cartLine], [addLine]);

  for (const p of cartAfter[0].product) {
    const stock = product.list?.find((s: any) => s.name === p.name);
    if (!stock) return `${p.name}은(는) 없는 상품입니다.`;
    if (p.count > stock.count) return `${p.name}의 재고가 부족합니다.`;
  }

  const keepLine = (user?.keep ?? []).filter((k: any) => k.num === num);
  const overItem = overCapItem(mergeKeep(keepLine, cartAfter));
  if (overItem)
    return `${overItem}은(는) 장바구니와 배송중을 합쳐 최대 ${MAX_PER_ITEM}개까지 담을 수 있습니다.`;

  return null;
}
