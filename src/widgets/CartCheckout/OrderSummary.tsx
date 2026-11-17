import AddressEditor from '@/features/address/ui/AddressEditor';
import BuyBtn from '@/features/purchase/ui/BuyBtn';
import { comma } from '@/shared/lib/comma';
import RoadDeco from './RoadDeco';
import type { CartCheckoutState } from './useCartCheckout';
import * as s from './cartCheckout.css';

// 오른쪽: 배송지 · 포인트 사용 · 결제 금액
export default function OrderSummary({ c }: { c: CartCheckoutState }) {
  const { owned, used, hasSel, subtotal, shipping, pay, reward, clamp, applyPoint, buyProps, buyLabel } = c;
  return (
    <aside aria-label='주문 요약' className={s.summary}>
      <section className={s.block}>
        <AddressEditor>
        <RoadDeco />
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
  );
}
