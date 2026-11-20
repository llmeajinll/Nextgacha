import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { AdminReview } from '../model/types';
import { avgOf, fmt, isLow } from '../lib/reviewStats';
import Stars from './Stars';
import * as s from './reviewBoard.css';

// 맨 위 요약: 평균 별점·별점 분포(누르면 그 별점의 최신 리뷰로)·숫자 타일
export default function ReviewSummary({
  reviews,
  weekAgo,
  activeStar,
  onPickStar,
}: {
  reviews: AdminReview[];
  weekAgo: string;
  activeStar: number | null;
  onPickStar: (n: number) => void;
}) {
  const avg = avgOf(reviews);
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rate === n).length }));
  const maxDist = Math.max(...dist.map((d) => d.count), 1);

  return (
  <section aria-label='리뷰 요약' className={s.summary}>
    <div className={s.avgBox}>
      <div className={s.avgText}>
        <span className={s.muted}>평균 별점</span>
        <span className={s.avgNum}>{avg.toFixed(1)}</span>
        <Stars value={avg} size={16} />
      </div>
      <div className={s.dist}>
        {dist.map((d) => (
          <button
            key={d.n}
            type='button'
            aria-pressed={activeStar === d.n}
            aria-label={`${d.n}점 리뷰 ${d.count}개 보기`}
            className={s.distRow}
            onClick={() => onPickStar(d.n)}
          >
            <span className={s.distN}>{d.n}</span>
            <span className={s.distTrack}>
              <span
                className={d.n <= 2 ? s.distFillLow : s.distFill}
                style={assignInlineVars({ [s.barWidth]: `${Math.round((d.count / maxDist) * 100)}%` })}
              />
            </span>
            <span className={s.distCount}>{d.count}</span>
          </button>
        ))}
      </div>
    </div>
    {[
      { label: '전체 리뷰', value: reviews.length },
      { label: '최근 7일', value: reviews.filter((r) => r.created_at.slice(0, 10) >= weekAgo).length },
      { label: '낮은 별점 (1~2점)', value: reviews.filter(isLow).length },
    ].map((t) => (
      <div key={t.label} className={s.tile}>
        <span className={s.muted}>{t.label}</span>
        <span className={s.tileNum}>
          {fmt(t.value)}
          <span className={s.tileUnit}>개</span>
        </span>
      </div>
    ))}
  </section>
  );
}
