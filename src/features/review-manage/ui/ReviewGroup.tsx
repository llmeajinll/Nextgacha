import Image from 'next/image';
import { ChevronDown, ChevronLeft, ChevronRight } from 'pixelarticons/react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { AdminReview } from '../model/types';
import { avgOf, day, fmt, isLow } from '../lib/reviewStats';
import ReviewCard from './ReviewCard';
import Stars from './Stars';
import * as s from './reviewBoard.css';

const GROUP_PAGE = 6;

export type ReviewGroupData = {
  num: number;
  name: string;
  image?: string;
  rs: AdminReview[];
  avg: number;
  low: number;
  latest: string;
};

// 상품 하나의 리뷰 묶음. 펼치면 옵션별 평균과 리뷰 카드
export default function ReviewGroup({
  g,
  isOpen,
  opt,
  setOpt,
  rpage,
  setRpage,
  toggleGroup,
  weekAgo,
}: {
  g: ReviewGroupData;
  isOpen: boolean;
  opt: string;
  setOpt: (o: string) => void;
  rpage: number;
  setRpage: (p: number) => void;
  toggleGroup: (num: number) => void;
  weekAgo: string;
}) {
  const pct = (n: number) => `${g.rs.length ? Math.round((n / g.rs.length) * 100) : 0}%`;
  const good = g.rs.filter((r) => r.rate >= 4).length;
  const opts = [...new Set(g.rs.flatMap((r) => r.options))].sort();
  const inOpt = isOpen && opt ? g.rs.filter((r) => r.options.includes(opt)) : g.rs;
  // 확인이 필요한 순: 최근 7일 안의 1~2점 → 나머지 1~2점 → 최신
  const rank = (r: AdminReview) => (isLow(r) ? (r.created_at.slice(0, 10) >= weekAgo ? 0 : 1) : 2);
  const sorted = [...inOpt].sort((a, b) => rank(a) - rank(b) || b.created_at.localeCompare(a.created_at));
  const rLast = Math.max(Math.ceil(sorted.length / GROUP_PAGE), 1);
  const rCur = isOpen ? Math.min(rpage, rLast) : 1;

  return (
    <article className={s.group}>
      <button type='button' aria-expanded={isOpen} className={s.groupHead} onClick={() => toggleGroup(g.num)}>
        <Image src={g.image || '/images/defaultImg.png'} alt='' width={52} height={52} className={s.groupThumb} />
        <span className={s.groupText}>
          <span className={s.groupName}>{g.name}</span>
          <span className={s.muted}>
            리뷰 {g.rs.length}개 · 최근 {day(g.latest)}
          </span>
        </span>
        <span className={s.groupAvg}>
          <span className={s.groupAvgNum}>{g.avg.toFixed(1)}</span>
          <Stars value={g.avg} size={12} />
        </span>
        <span
          role='img'
          aria-label={`4~5점 ${good}개, 3점 ${g.rs.length - good - g.low}개, 1~2점 ${g.low}개`}
          className={s.mix}
        >
          <span className={s.mixGood} style={assignInlineVars({ [s.barWidth]: pct(good) })} />
          <span className={s.mixMid} style={assignInlineVars({ [s.barWidth]: pct(g.rs.length - good - g.low) })} />
          <span className={s.mixLow} style={assignInlineVars({ [s.barWidth]: pct(g.low) })} />
        </span>
        <span className={g.low ? s.lowTag : s.noLowTag}>{g.low ? `낮은 별점 ${g.low}` : '낮은 별점 없음'}</span>
        <ChevronDown aria-hidden className={isOpen ? s.chevOpen : s.chev} />
      </button>

      {isOpen && (
        <div className={s.groupBody}>
          {opts.length > 0 && (
            <div className={s.options}>
              <span className={s.pixelLabel}>OPTIONS</span>
              <div role='group' aria-label='옵션으로 거르기' className={s.chips}>
                {['', ...opts].map((o) => {
                  const rs = o ? g.rs.filter((r) => r.options.includes(o)) : g.rs;
                  return (
                    <button
                      key={o || 'all'}
                      type='button'
                      aria-pressed={opt === o}
                      className={s.chip}
                      onClick={() => {
                        setOpt(o);
                        setRpage(1);
                      }}
                    >
                      <span>{o || '전체'}</span>
                      <span className={s.chipCount}>{avgOf(rs).toFixed(1)}</span>
                      <span className={s.chipSub}>{rs.length}개</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className={s.cards}>
            {sorted.slice((rCur - 1) * GROUP_PAGE, rCur * GROUP_PAGE).map((r, i) => (
              <ReviewCard key={`${r.created_at}-${i}`} r={r} />
            ))}
          </div>
          <div className={s.groupFoot}>
            <span className={s.muted}>
              전체 {fmt(sorted.length)}개 중 {(rCur - 1) * GROUP_PAGE + 1}–{Math.min(rCur * GROUP_PAGE, sorted.length)} ·
              확인이 필요한 순 (최근 1~2점 → 1~2점 → 최신)
            </span>
            {rLast > 1 && (
              <div className={s.pager}>
                <button
                  type='button'
                  aria-label='이전 리뷰'
                  disabled={rCur <= 1}
                  className={s.iconBtn}
                  onClick={() => setRpage(rCur - 1)}
                >
                  <ChevronLeft aria-hidden />
                </button>
                <span className={s.pageText}>
                  {rCur} / {rLast}
                </span>
                <button
                  type='button'
                  aria-label='다음 리뷰'
                  disabled={rCur >= rLast}
                  className={s.iconBtn}
                  onClick={() => setRpage(rCur + 1)}
                >
                  <ChevronRight aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
