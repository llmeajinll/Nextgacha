'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ImgBtn } from '@/shared/ui';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import postErrorReport from '../api/postErrorReport';
import * as s from './errorReport.css';

const MIN = 5;
const MAX = 200;

// 오류 신고 버튼 + 신고 창 (버튼 왼쪽 위로 열림). 버튼 모양은 놓이는 곳(위젯)이 className으로 정한다
export default function ErrorReport({ buttonClassName, openClassName }: { buttonClassName?: string; openClassName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);

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
    const ok = await postErrorReport(text, pathname);
    alert(ok ? '전송되었습니다.' : '오류가 발생하여 전송되지 못했습니다.');
    if (ok) {
      setText('');
      setOpen(false);
    }
  };

  return (
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
      className={`${buttonClassName ?? ''} ${open ? (openClassName ?? '') : ''}`}
      onClick={() => setOpen((v) => !v)}
    />
  </div>
  );
}
