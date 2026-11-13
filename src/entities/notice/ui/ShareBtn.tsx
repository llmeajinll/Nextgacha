'use client';

import React, { useState } from 'react';
import { Check, Share } from 'pixelarticons/react';
import { btn, btnIcon, btnKind } from '@/styles/ui.css';
import { shareBtn } from './notice.css';

// 기기 공유창이 있으면 그걸 열고, 없으면 주소를 복사
export default function ShareBtn({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) return await navigator.share({ title, url });
      await navigator.clipboard.writeText(url);
    } catch {
      return; // 공유 취소·복사 거부
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type='button'
      className={`${btn} ${btnKind.neutral} ${btnIcon} ${shareBtn}`}
      onClick={share}
      aria-label={copied ? '링크를 복사했어요' : '공유하기'}
      title='공유'
    >
      {copied ? <Check width={20} height={20} aria-hidden /> : <Share width={20} height={20} aria-hidden />}
    </button>
  );
}
