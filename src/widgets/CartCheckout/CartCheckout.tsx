'use client';

import Link from 'next/link';
import { Check } from 'pixelarticons/react';
import { Cart } from '@/features/cart/ui';
import BuyBtn from '@/features/purchase/ui/BuyBtn';
import { MAX_PER_ITEM } from '@/features/purchase/lib/orderPolicy';
import { comma } from '@/shared/lib/comma';
import { checkbox } from '@/styles/ui.css';
import OrderSummary from './OrderSummary';
import useCartCheckout from './useCartCheckout';
import * as s from './cartCheckout.css';

const SHOP = '/search?type=main&tag=전체 상품&page=1';

// 마이페이지 장바구니: 담은 상품 고르기(cart) + 배송지(address) + 결제(purchase)
export default function CartCheckout() {
  const c = useCartCheckout();
  const { items, isPending, eraseMany, lines, selected, allOn, isSelected, toggleLine, toggleAll, closed, toggleOpen, pay, reward, buyProps, buyLabel } = c;

  if (items.length === 0) {
    return (
      <div className={s.empty}>
        <span className={s.emptyTitle}>EMPTY CART</span>
        <span className={s.emptyText}>장바구니가 비어 있어요. 마음에 드는 캐릭터를 담아 보세요.</span>
        <Link href={SHOP} className={s.shopBtn}>
          SHOP
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={s.layout}>
        <section aria-label='담은 상품' className={s.items}>
          <div className={s.toolbar}>
            <button type='button' role='checkbox' aria-checked={allOn} aria-label='전체 선택' className={checkbox} onClick={toggleAll}>
              {allOn && <Check width={16} height={16} aria-hidden />}
            </button>
            <span className={s.allLabel}>
              전체 선택
              <span className={s.allCount}>
                {selected.length} / {lines.length}
              </span>
            </span>
            <button
              type='button'
              className={s.removeBtn}
              disabled={selected.length === 0 || isPending}
              onClick={() => eraseMany(selected.map(({ num, name }) => ({ num, name })))}
            >
              선택 삭제
            </button>
          </div>

          {items.map((it) => (
            <Cart
              key={it.cart.num}
              item={it}
              isSelected={isSelected}
              onToggleLine={toggleLine}
              open={!closed.has(it.cart.num)}
              onToggleOpen={() => toggleOpen(it.cart.num)}
              maxPerItem={MAX_PER_ITEM}
            />
          ))}
        </section>

        <OrderSummary c={c} />
      </div>

      <div className={s.payBar}>
        <span className={s.payBarText}>
          <span className={s.muted}>
            {selected.reduce((a, l) => a + l.count, 0)}개 · 적립 {comma(reward)}P
          </span>
          <span className={s.payBarValue}>{comma(pay)} WON</span>
        </span>
        <div className={s.payBarBtn}>
          <BuyBtn props={buyProps} block label={buyLabel} />
        </div>
      </div>
    </>
  );
}
