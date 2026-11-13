import React from 'react';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import * as s from './tagContainer.css';

// 상품 카드의 NEW · HOT · 예약 태그
export default function TagContainer({ create, reserve }: { create: string; reserve: string }) {
  return (
    <div className={s.container}>
      {create && (
        <>
          <span className={`${s.pxTag} ${s.tone.new}`}>NEW</span>
          <span className={`${s.pxTag} ${s.tone.hot}`}>HOT</span>
        </>
      )}
      {reserve && <span className={`${s.reserveTag} ${s.tone.reserve}`}>{toKoreaTime(reserve).format('YYYY년 MM월')} 예약</span>}
    </div>
  );
}
