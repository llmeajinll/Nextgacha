'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'pixelarticons/react';
import { ImgBtn } from '@/shared/ui';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import * as s from './floatingActions.css';

const MIN = 5;
const MAX = 200;

// 오른쪽 아래 고정 버튼: 맨 위로 + 오류 신고 (예전에는 헤더 오른쪽 사이렌 아이콘이었음)
export default function FloatingActions({ lift = 'none' }: { lift?: keyof typeof s.lift }) {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // 조금(200px) 내려가면 GO TOP을 보여준다
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const send = async () => {
    if (text.trim().length < MIN) {
      alert(`${MIN}자 이상 입력해주세요.`);
      return;
    }
    const res = await fetch('/api/postError', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textareaValue: text, pathname: decodeURIComponent(pathname) }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    alert(data?.ok === true ? '전송되었습니다.' : '오류가 발생하여 전송되지 못했습니다.');
    if (data?.ok === true) {
      setText('');
      setOpen(false);
    }
  };

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

      <div ref={wrapRef} className={s.reportWrap}>
        {open && (
          <div role='dialog' aria-label='오류 신고' className={s.panel}>
            <span className={s.panelTitle}>오류 신고</span>
            <span className={s.panelHint}>지금 보고 있는 화면 주소가 같이 전송됩니다.</span>
            <div className={textareaBox}>
              <textarea
                autoFocus
                placeholder={`어떤 문제가 있었는지 적어주세요 (${MIN}~${MAX}자)`}
                className={s.textarea}
                maxLength={MAX}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <span className={textareaCount}>
                {text.length}/{MAX}
              </span>
            </div>
            <button type='button' className={s.sendBtn} onClick={send}>
              SEND
            </button>
          </div>
        )}
        <ImgBtn
          img='report'
          title='오류 신고'
          size={24}
          className={`${s.reportBtn} ${open ? s.reportOn : ''}`}
          onClick={() => setOpen((v) => !v)}
        />
      </div>
    </div>
  );
}
