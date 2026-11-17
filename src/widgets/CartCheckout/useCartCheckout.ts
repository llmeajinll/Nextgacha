import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCart } from '@/features/cart/model';
import type { CartItem } from '@/features/cart/model/types';
import { calcOrder } from '@/features/purchase/lib/orderPolicy';
import { userInfoAtom } from '@/entities/user/model/store';
import { comma } from '@/shared/lib/comma';

const key = (num: number, name: string) => `${num}:${name}`;

// 장바구니 결제 화면 상태: 고른 옵션, 접힌 상품, 쓸 포인트, 금액 계산
export default function useCartCheckout() {
  const { data: user } = useAtomValue(userInfoAtom);
  const { data, eraseMany, isPending } = useCart();
  const items: CartItem[] = Array.isArray(data) ? data : [];

  // 기본은 모두 선택. 새로 담긴 옵션도 선택된 채로 보이게 "뺀 것"만 기억한다
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<number>>(new Set());
  const [point, setPoint] = useState(0);
  const [clamp, setClamp] = useState('');

  const lines = useMemo(
    () => items.flatMap((it) => (it.cart?.list ?? []).map((l) => ({ num: it.cart.num, name: l.name, count: l.count }))),
    [items],
  );
  const isSelected = (num: number, name: string) => !unchecked.has(key(num, name));
  const selected = lines.filter((l) => isSelected(l.num, l.name));
  const allOn = lines.length > 0 && selected.length === lines.length;

  const toggleLine = (num: number, name: string) =>
    setUnchecked((prev) => {
      const next = new Set(prev);
      const k = key(num, name);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  const toggleAll = () => setUnchecked(allOn ? new Set(lines.map((l) => key(l.num, l.name))) : new Set());
  const toggleOpen = (num: number) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });

  // 결제에 보낼 목록: 선택한 옵션만, 상품(num)별로 묶음
  const orderList = useMemo(
    () =>
      items
        .map((it) => ({
          num: it.cart.num,
          title: it.stock.title,
          product: (it.cart.list ?? [])
            .filter((l) => !unchecked.has(key(it.cart.num, l.name)))
            .map((l) => ({ name: l.name, count: l.count })),
        }))
        .filter((g) => g.product.length > 0),
    [items, unchecked],
  );

  // 금액 규칙은 서버 검증(verifyOrder)과 같은 orderPolicy.calcOrder를 쓴다
  const products = items.map((it) => ({ num: it.cart.num, price: it.stock.price, discount: it.stock.discount }));
  const owned = user?.point ?? 0;
  const base = calcOrder(products, orderList, 0);
  const hasSel = orderList.length > 0 && base !== null;
  const maxPoint = hasSel ? Math.max(0, Math.min(owned, base.maxUsablePoint)) : 0;
  // 선택을 바꿔 한도가 줄어도 입력값이 자동으로 한도 안으로 들어온다
  const used = Math.min(point, maxPoint);
  const subtotal = hasSel ? base.subtotal : 0;
  const shipping = hasSel ? base.shipping : 0;
  const pay = hasSel ? base.total - used : 0;
  const reward = hasSel ? base.addPoint : 0;

  const applyPoint = (raw: string) => {
    const n = Number(raw.replace(/[^0-9]/g, '')) || 0;
    if (n > maxPoint) {
      setClamp(maxPoint === owned ? '보유 포인트까지만 쓸 수 있어요.' : `결제 금액은 최소 1,000원이 남아야 해서 ${comma(maxPoint)}P까지 쓸 수 있어요.`);
      setPoint(maxPoint);
    } else {
      setClamp('');
      setPoint(n);
    }
  };

  const buyProps = { price: pay, usedPoint: used, list: orderList };
  const buyLabel = hasSel ? 'BUY' : 'SELECT ITEMS';

  return { items, isPending, eraseMany, lines, selected, allOn, isSelected, toggleLine, toggleAll, closed, toggleOpen, owned, used, hasSel, subtotal, shipping, pay, reward, clamp, applyPoint, buyProps, buyLabel };
}

export type CartCheckoutState = ReturnType<typeof useCartCheckout>;
