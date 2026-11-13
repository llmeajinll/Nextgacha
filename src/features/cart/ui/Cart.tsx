'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronDown, Minus, Plus, Trash } from 'pixelarticons/react';
import { comma } from '@/shared/lib/comma';
import { useCart } from '../model';
import * as s from './cart.css';

type Line = { name: string; count: number };

// 상품 하나(num)의 옵션 묶음 카드. 선택·접기 상태는 CartTemplate이 들고 있다
export default function Cart({
  item,
  isSelected,
  onToggleLine,
  open,
  onToggleOpen,
  maxPerItem,
}: {
  item: any;
  isSelected: (num: number, name: string) => boolean;
  onToggleLine: (num: number, name: string) => void;
  open: boolean;
  onToggleOpen: () => void;
  maxPerItem: number;
}) {
  const { cart, keep, stock } = item;
  const { increase, decrease, erase, isPending } = useCart();
  const list: Line[] = cart?.list ?? [];
  if (list.length === 0) return null;

  const unit = stock.price * (1 - (stock.discount ?? 0) / 100);
  const qtySum = list.reduce((a, l) => a + l.count, 0);
  const countOf = (src: any, name: string) => src?.list?.find((v: any) => v.name === name)?.count ?? 0;

  return (
    <article className={s.group}>
      <header className={s.head}>
        <Link href={`/${cart.num}/info`} tabIndex={-1} aria-hidden>
          <Image
            src={`${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${cart.num}.png`}
            width={72}
            height={72}
            alt=''
            className={s.thumb}
          />
        </Link>
        <span className={s.headText}>
          <Link href={`/${cart.num}/info`} className={s.title}>
            {stock.title}
          </Link>
          <span className={s.sub}>
            옵션 {list.length}종 · <span className={s.pxBlue}>{qtySum}</span>개 담음
          </span>
        </span>
        <span className={s.sum}>
          {comma(unit * qtySum)}
          <span className={s.sumUnit}> WON</span>
        </span>
        <button
          type='button'
          className={s.iconBtn}
          onClick={onToggleOpen}
          aria-expanded={open}
          aria-label={`${open ? '접기' : '펼치기'}: ${stock.title}`}
        >
          <ChevronDown width={18} height={18} aria-hidden className={`${s.chevron} ${open ? s.chevronOpen : ''}`} />
        </button>
      </header>

      {!open ? (
        <div className={s.chips}>
          {list.map((l) => (
            <span key={l.name} className={`${s.chip} ${isSelected(cart.num, l.name) ? '' : s.chipOff}`}>
              {l.name}
              <span className={s.chipQty}>×{l.count}</span>
            </span>
          ))}
        </div>
      ) : (
        list.map((l) => {
          const on = isSelected(cart.num, l.name);
          const shipping = countOf(keep, l.name);
          // 더 담을 수 있는 최대: 1인 한도에서 배송중을 뺀 값과 재고 중 작은 값 (useCart.increase와 같은 기준)
          const cap = Math.min(maxPerItem - shipping, countOf(stock, l.name));
          return (
            <div key={l.name} className={`${s.line} ${on ? '' : s.lineOff}`}>
              <button
                type='button'
                role='checkbox'
                aria-checked={on}
                aria-label={`${l.name} 선택`}
                className={s.checkbox}
                onClick={() => onToggleLine(cart.num, l.name)}
              >
                {on && <Check width={16} height={16} aria-hidden />}
              </button>
              <span className={s.name}>
                <span className={s.nameText}>{l.name}</span>
                <span className={s.sub}>
                  {comma(unit)}원
                  {shipping > 0 && (
                    <>
                      {' · '}
                      <span className={s.ship}>{shipping}개 배송 중</span> · {Math.max(cap, 0)}개 담기 가능
                    </>
                  )}
                </span>
              </span>
              <span role='group' aria-label={`${l.name} 수량`} className={s.stepper}>
                <button
                  type='button'
                  className={s.stepBtn}
                  aria-label='하나 빼기'
                  disabled={isPending || l.count <= 1}
                  onClick={() => decrease(cart.num, l.name)}
                >
                  <Minus width={16} height={16} aria-hidden />
                </button>
                <span className={s.qty} aria-live='polite'>
                  {l.count}
                </span>
                <button
                  type='button'
                  className={s.stepBtn}
                  aria-label='하나 더 담기'
                  disabled={isPending || l.count >= cap}
                  onClick={() => increase(shipping, countOf(stock, l.name), cart.num, l.name, l.count)}
                >
                  <Plus width={16} height={16} aria-hidden />
                </button>
              </span>
              <span className={s.total}>{comma(unit * l.count)}</span>
              <button
                type='button'
                className={s.del}
                aria-label={`${l.name} 빼기`}
                disabled={isPending}
                onClick={() => erase(cart.num, l.name)}
              >
                <Trash width={16} height={16} aria-hidden />
              </button>
            </div>
          );
        })
      )}
    </article>
  );
}
