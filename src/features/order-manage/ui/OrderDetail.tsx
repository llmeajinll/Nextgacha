import { comma } from '@/shared/lib/comma';
import type { AdminOrder } from '../model/status';
import * as s from './order.css';

// 주문 카드 본문: 상품·옵션 목록과 고객·배송지·결제·중복 의심 정보
export default function OrderDetail({ order }: { order: AdminOrder }) {
  return (
    <div className={s.body}>
      <div className={s.items}>
        <span className={s.pixelLabel}>ITEMS · {order.list.length}</span>
        {order.list.map((item) => (
          <div key={item.num} className={s.item}>
            <div className={s.itemTitle}>
              <span className={s.itemNum}>{item.num}</span>
              <span>{item.title || `${item.num}번 상품`}</span>
            </div>
            <div className={s.options}>
              {item.product.map((p) => (
                <span key={p.name} className={s.option}>
                  {p.name}
                  <b className={s.optionCount}>×{p.count}</b>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <dl className={s.info}>
        <dt>고객</dt>
        <dd>{order.customer}</dd>
        <dt>이메일</dt>
        <dd className={s.wrap}>{order.email}</dd>
        <dt>배송지</dt>
        <dd>{order.address}</dd>
        <dt>결제</dt>
        <dd>
          {comma(order.totalPrice)}원{' '}
          <span className={s.muted}>
            · 포인트 사용 {comma(order.usedPoint ?? 0)}P · 적립 {comma(order.addPoint ?? 0)}P
          </span>
        </dd>
        {!!order.suspects?.length && (
          <>
            <dt className={s.suspectLabel}>중복 의심</dt>
            <dd className={s.suspect}>
              같은 상품을 산 다른 계정이 있어요. 보내기 전에 확인해 주세요.
              {order.suspects.map((x) => (
                <span key={x.orderId} className={s.wrap}>
                  {x.email} <span className={s.muted}>· 주문 {x.orderId} · {x.by.join(', ')}</span>
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}
