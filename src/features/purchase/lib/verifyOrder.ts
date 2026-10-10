import { productColl, userColl } from '@/shared/api/mongodb';
import {
  calcOrder,
  isValidOrderList,
  mergeKeep,
  overCapItem,
} from './orderPolicy';

// Toss 승인 전에 클라이언트 값을 DB 기준으로 재검증.
// 여기서 거르면 돈이 빠져나가기 전에 거절할 수 있다.
// (동시성 최종 방어는 트랜잭션 안의 reducePoint/reduceStock)
export async function verifyOrder({
  email,
  list,
  amount,
  usedPoint,
}: {
  email: string;
  list: unknown;
  amount: number;
  usedPoint: number;
}) {
  const fail = (message: string) => ({ ok: false as const, message });

  if (!isValidOrderList(list)) return fail('주문 정보가 올바르지 않습니다.');
  if (!Number.isInteger(usedPoint) || usedPoint < 0)
    return fail('사용 포인트가 올바르지 않습니다.');
  if (!Number.isFinite(amount)) return fail('결제 금액이 올바르지 않습니다.');

  const products = await productColl
    .find({ num: { $in: list.map((l) => l.num) } })
    .project<{ num: number; price: number; discount?: number; title: string }>(
      { _id: 0, num: 1, price: 1, discount: 1, title: 1 },
    )
    .toArray();

  const calc = calcOrder(products, list, usedPoint);
  if (!calc) return fail('존재하지 않는 상품이 포함되어 있습니다.');
  if (usedPoint > calc.maxUsablePoint)
    return fail('사용 가능한 포인트를 초과했습니다.');
  // ponytail: 할인가가 소수일 수 있어 1원 미만 오차 허용, 단가를 정수로 맞추면 === 비교로
  if (Math.abs(calc.total - amount) >= 1)
    return fail('결제 금액이 주문 금액과 일치하지 않습니다.');

  const user = await userColl.findOne(
    { email },
    { projection: { point: 1, keep: 1 } },
  );
  if (!user) return fail('유저를 찾을 수 없습니다.');
  if ((user.point ?? 0) < usedPoint) return fail('포인트가 부족합니다.');

  const overItem = overCapItem(mergeKeep(user.keep ?? [], list));
  if (overItem)
    return fail(`${overItem}은(는) 1인당 최대 5개까지 보유할 수 있습니다.`);

  // 주문에 저장할 list는 클라이언트 값 대신 DB 기준 title + 검증된 수량만
  const titleMap = new Map(products.map((p) => [p.num, p.title]));
  const orderList = list.map((l) => ({
    num: l.num,
    title: titleMap.get(l.num),
    product: l.product.map(({ name, count }) => ({ name, count })),
  }));

  return { ok: true as const, addPoint: calc.addPoint, orderList };
}
