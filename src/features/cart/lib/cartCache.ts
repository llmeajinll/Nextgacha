import type { CartItem, Stock } from '../model/types';

// 낙관적 업데이트용: 서버 응답 전에 서버가 할 일을 캐시에 먼저 똑같이 한다.

// /api/updateCart와 같은 규칙: 수량 ±1(감소는 1 아래로 안 감), 삭제 후 빈 상품 묶음은 빠진다
export function applyCartChange(
  items: CartItem[],
  num: number,
  name: string,
  preset: 'increase' | 'decrease' | 'erase',
): CartItem[] {
  return items
    .map((it) => {
      if (it.num !== num) return it;
      const list =
        preset === 'erase'
          ? it.cart.list.filter((v) => v.name !== name)
          : it.cart.list.map((v) =>
              v.name !== name ? v : { ...v, count: preset === 'increase' ? v.count + 1 : Math.max(1, v.count - 1) },
            );
      return { ...it, cart: { ...it.cart, list } };
    })
    .filter((it) => it.cart.list.length > 0);
}

// /api/protected/postCart와 같은 규칙: 이미 있는 옵션은 수량을 더하고, 없으면 새로 붙인다
export function addToCartList(cart: Stock[], added: Stock[]): Stock[] {
  const next = cart.map((v) => ({ ...v, count: v.count + (added.find((a) => a.name === v.name)?.count ?? 0) }));
  for (const a of added) if (!cart.some((v) => v.name === a.name)) next.push({ ...a });
  return next;
}
