import React, { useState } from 'react';
import type { AdminReview } from '../model/types';
import { HIDE_REASONS } from '@/shared/model/reviewHideReasons';
import postReviewHide from '../api/postReviewHide';
import { day } from '../lib/reviewStats';
import Stars from './Stars';
import * as s from './reviewBoard.css';

// 숨김은 삭제가 아니라 쇼핑몰 표시만 막는다 (reviews.md)
function HideControl({ r }: { r: AdminReview }) {
  const [hidden, setHidden] = useState(r.hidden);
  const [reason, setReason] = useState<string>(r.hiddenReason ?? HIDE_REASONS[0]);
  const [sending, setSending] = useState(false);
  const toggle = async () => {
    setSending(true);
    try {
      await postReviewHide({ num: r.num, orderId: r.orderId, hidden: !hidden, reason });
      setHidden(!hidden);
    } catch (e) {
      alert(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };
  return (
    <span className={s.hideCtl}>
      {hidden ? (
        <span className={s.hiddenTag}>숨김 · {reason}</span>
      ) : (
        <select aria-label='숨김 사유' value={reason} onChange={(e) => setReason(e.target.value)} className={s.hideSelect}>
          {HIDE_REASONS.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      )}
      <button type='button' disabled={sending} onClick={toggle} className={s.hideBtn}>
        {hidden ? '다시 보이기' : '숨기기'}
      </button>
    </span>
  );
}

export default function ReviewCard({ r, showProduct }: { r: AdminReview; showProduct?: boolean }) {
  return (
    <article className={r.hidden ? `${s.card} ${s.cardHidden}` : s.card}>
      <div className={s.cardBody}>
        <div className={s.cardHead}>
          <span className={s.rateNum}>{r.rate}.0</span>
          <Stars value={r.rate} size={14} />
          <span className={s.date}>{day(r.created_at)}</span>
        </div>
        <span className={s.optionLine}>
          {r.options.length > 0 && <span className={s.optionTag}>{r.options.join(', ')}</span>}
          {showProduct && <span className={s.ellipsis}>{r.product}</span>}
        </span>
        <p className={s.content}>{r.content}</p>
      </div>
      <div className={s.cardFoot}>
        {r.writer}
        <HideControl r={r} />
      </div>
    </article>
  );
}
