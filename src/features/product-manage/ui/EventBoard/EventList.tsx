import Image from 'next/image';
import { Pagination } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import { discountOf, saleOf } from '../../lib/discount';
import { EVENT_PAGE_SIZE, type DiscountEvent } from '../../model/useDiscountEvent';
import * as s from './eventBoard.css';

// 왼쪽: 체크해서 고르는 상품 목록
export default function EventList({ ev }: { ev: DiscountEvent }) {
  return (
    <section aria-label='상품 목록' className={s.listCol}>
      <div className={s.panel}>
        <div className={s.listHead}>
          <label className={s.checkLabel}>
            <span className={s.checkCell}>
              <input
                type='checkbox'
                checked={ev.pageChecked}
                onChange={() => {
                  const next = new Set(ev.checked);
                  for (const p of ev.pickable) {
                    if (ev.pageChecked) next.delete(p.num);
                    else next.add(p.num);
                  }
                  ev.select(next);
                }}
                className={s.checkInput}
              />
            </span>
            이 페이지 전체 선택
          </label>
          <label className={s.subCheckLabel}>
            <input
              type='checkbox'
              checked={ev.skipReserve}
              onChange={() => ev.setSkipReserve(!ev.skipReserve)}
              className={s.checkInput}
            />
            예약 상품은 전체 선택에서 빼기
          </label>
        </div>
        <div className={s.scroll}>
          <div className={s.table}>
            <div className={s.head}>
              <span />
              <span>PRODUCT</span>
              <span className={s.right}>PRICE</span>
              <span className={s.right}>NOW</span>
              <span className={s.right}>AFTER</span>
            </div>
            {ev.pageItems.map((p) => {
              const on = ev.checked.has(p.num);
              const cur = discountOf(p);
              return (
                <label key={p.num} className={on ? `${s.row} ${s.rowOn}` : s.row}>
                  <span className={s.checkCell}>
                    <input
                      type='checkbox'
                      checked={on}
                      onChange={() => ev.toggle(p.num)}
                      aria-label={`${p.title} 선택`}
                      className={s.checkInput}
                    />
                  </span>
                  <div className={s.product}>
                    <Image
                      src={p.image?.[0] || '/images/defaultImg.png'}
                      alt=''
                      width={52}
                      height={52}
                      className={s.thumb}
                    />
                    <div className={s.productText}>
                      <span className={s.titleLine}>
                        <span className={s.num}>{p.num}</span>
                        <span className={s.productTitle}>{p.title}</span>
                      </span>
                      {(p.reserve || cur > 0) && (
                        <div className={s.tags}>
                          {p.reserve && (
                            <span
                              className={s.reserveTag}
                            >{`${toKoreaTime(p.reserve).format('YYYY년 MM월')} 예약`}</span>
                          )}
                          {cur > 0 && <span className={s.discountTag}>{`${cur}% 할인 중`}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={s.right}>{comma(p.price)}원</span>
                  <span className={`${s.right} ${cur ? s.now : s.muted}`}>{cur ? `${cur}%` : '—'}</span>
                  {on && ev.rateOk ? (
                    <span className={s.after}>
                      <span className={s.afterNew}>{saleOf(p.price, ev.rateNum)}원</span>
                      <span className={s.afterSub}>{ev.rateNum}% 적용</span>
                    </span>
                  ) : (
                    <span className={`${s.right} ${cur ? '' : s.muted}`}>
                      {cur ? `${saleOf(p.price, cur)}원` : '—'}
                    </span>
                  )}
                </label>
              );
            })}
            {!ev.isPending && ev.shown.length === 0 && (
              <div className={s.empty}>
                <span className={s.emptyTitle}>조건에 맞는 상품이 없어요.</span>
                <span>검색어를 바꾸거나 다른 카테고리를 골라 보세요.</span>
              </div>
            )}
            {ev.isPending && <div className={s.empty}>불러오는 중…</div>}
          </div>
        </div>
      </div>

      <Pagination current={ev.curPage} total={ev.shown.length} pageSize={EVENT_PAGE_SIZE} onChange={ev.setPage} />
    </section>
  );
}
