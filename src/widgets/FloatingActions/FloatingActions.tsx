'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'pixelarticons/react';
import ErrorReport from '@/features/error-report/ui/ErrorReport';
import * as s from './floatingActions.css';

// 오른쪽 아래 고정 버튼: 맨 위로 + 오류 신고 (예전에는 헤더 오른쪽 사이렌 아이콘이었음)
export default function FloatingActions({ lift = 'none' }: { lift?: keyof typeof s.lift }) {
  const [showTop, setShowTop] = useState(false);

  // 조금(200px) 내려가면 GO TOP을 보여준다
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`${s.stack} ${s.lift[lift]}`}>
      {showTop && (
        <button
          type='button'
          className={s.topBtn}
          aria-label='맨 위로'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp width={18} height={18} aria-hidden />
          TOP
        </button>
      )}

      <ErrorReport buttonClassName={s.reportBtn} openClassName={s.reportOn} />
    </div>
  );
}
