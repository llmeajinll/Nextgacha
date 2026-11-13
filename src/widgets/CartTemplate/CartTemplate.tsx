'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { Check, Truck } from 'pixelarticons/react';
import { Cart } from '@/features/cart/ui';
import { useCart } from '@/features/cart/model';
import BuyBtn from '@/features/purchase/ui/BuyBtn';
import AddressEditor from '@/features/address/ui/AddressEditor';
import { calcOrder, MAX_PER_ITEM } from '@/features/purchase/lib/orderPolicy';
import { userInfoAtom } from '@/entities/user/model/store';
import { comma } from '@/shared/lib/comma';
import { vars } from '@/styles/theme.css';
import { checkbox } from '@/styles/ui.css';
import * as s from './carttemplate.css';

const SHOP = '/search?type=main&tag=전체 상품&page=1';
const key = (num: number, name: string) => `${num}:${name}`;

// 배송지 위 픽셀 길 장식 (나무·건물 위치는 디자인 캔버스 MyCart 그대로)
const TREE = { w: 10, h: 14, vb: '0 0 5 7' };
const ROAD = [
  { at: 14, kind: 'tree' },
  { at: 30, kind: 'tall' },
  { at: 38, kind: 'small' },
  { at: 56, kind: 'tree' },
  { at: 64, kind: 'tree' },
  { at: 78, kind: 'mid' },
  { at: 92, kind: 'tree' },
] as const;
const TREE_FILL = vars.tone.success[1];
const BUILDING = { tall: [5, 10], small: [4, 7], mid: [5, 9] } as const;

function RoadDeco({ kind }: { kind: (typeof ROAD)[number]['kind'] }) {
  if (kind === 'tree') {
    return (
      <svg width={TREE.w} height={TREE.h} viewBox={TREE.vb} shapeRendering='crispEdges'>
        <rect x='1' width='3' height='1' fill={TREE_FILL} />
        <rect y='1' width='5' height='3' fill={TREE_FILL} />
        <rect x='1' y='4' width='3' height='1' fill={TREE_FILL} />
        <rect x='2' y='5' width='1' height='2' fill={vars.slate[400]} />
      </svg>
    );
  }
  const [w, h] = BUILDING[kind];
  const windows = [];
  for (let y = 1; y < h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) windows.push(<rect key={`${x}${y}`} x={x} y={y} width='1' height='1' fill='white' />);
  return (
    <svg width={w * 2} height={h * 2} viewBox={`0 0 ${w} ${h}`} shapeRendering='crispEdges'>
      <rect width={w} height={h} fill={vars.slate[200]} />
      {windows}
    </svg>
  );
}

export default function CartTemplate() {
  const { data: user } = useAtomValue(userInfoAtom);
  const { data, eraseMany, isPending } = useCart();
  const items: any[] = Array.isArray(data) ? data : [];

  // 기본은 모두 선택. 새로 담긴 옵션도 선택된 채로 보이게 "뺀 것"만 기억한다
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<number>>(new Set());
  const [point, setPoint] = useState(0);
  const [clamp, setClamp] = useState('');

  const lines = useMemo(
    () => items.flatMap((it) => (it.cart?.list ?? []).map((l: any) => ({ num: it.cart.num, name: l.name, count: l.count }))),
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
            .filter((l: any) => !unchecked.has(key(it.cart.num, l.name)))
            .map((l: any) => ({ name: l.name, count: l.count })),
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

        <aside aria-label='주문 요약' className={s.summary}>
          <section className={s.block}>
            <AddressEditor>
            <div aria-hidden className={s.road}>
              <div className={s.scenery}>
                {[0, 1].map((tile) => (
                  <span key={tile} className={s.sceneryTile}>
                    {ROAD.map((d) => (
                      <span key={d.at} className={`${s.roadDeco} ${s.roadAt[d.at]}`}>
                        <RoadDeco kind={d.kind} />
                      </span>
                    ))}
                    <span className={s.roadLine} />
                  </span>
                ))}
              </div>
              <span className={s.truckDrive}>
                <Truck width={16} height={16} className={s.truck} />
              </span>
            </div>
            </AddressEditor>
          </section>

          <section className={s.block}>
            <div className={s.blockHead}>
              <label htmlFor='cart-points' className={s.blockTitle}>
                포인트 사용
              </label>
              <span className={s.muted}>보유 {comma(owned)}P</span>
            </div>
            <div className={s.pointRow}>
              <label className={s.pointField}>
                <input
                  id='cart-points'
                  type='text'
                  inputMode='numeric'
                  placeholder='0'
                  value={used ? comma(used) : ''}
                  onChange={(e) => applyPoint(e.target.value)}
                  className={s.pointInput}
                />
                <span className={s.pointUnit}>P</span>
              </label>
              <button type='button' className={s.allPointBtn} onClick={() => applyPoint(String(owned))} disabled={!hasSel || owned === 0}>
                전액 사용
              </button>
            </div>
            {clamp && <span className={s.clampNote}>{clamp}</span>}
          </section>

          <section className={s.amounts}>
            <div className={s.amountRow}>
              <span>상품 금액</span>
              <span>{comma(subtotal)}원</span>
            </div>
            <div className={s.amountRow}>
              <span>포인트 사용</span>
              <span>-{comma(used)}원</span>
            </div>
            <div className={s.amountRow}>
              <span>배송비</span>
              <span>{!hasSel ? '-' : shipping === 0 ? '무료' : `${comma(shipping)}원`}</span>
            </div>
            <div className={s.payRow}>
              <span className={s.payLabel}>결제 금액</span>
              <span className={s.payValue}>{comma(pay)} WON</span>
            </div>
            <div className={s.reward}>
              적립 예정 <span className={s.rewardValue}>{comma(reward)}P</span>
            </div>
            <div className={s.webBuy}>
              <BuyBtn props={buyProps} block label={buyLabel} />
            </div>
          </section>
        </aside>
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
