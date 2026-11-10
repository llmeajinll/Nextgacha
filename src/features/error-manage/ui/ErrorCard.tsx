'use client';

import React, { useState } from 'react';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import type { AdminError, ErrorStatus } from '../model/types';
import { setErrorStatus } from '../api/errorActions';
import * as s from './errorCard.css';

const TYPE_LABEL = { payment: '결제', system: '시스템', report: '사용자 제보' } as const;
const DONE_MESSAGE: Record<ErrorStatus, string> = {
  접수: '접수로 되돌렸어요.',
  '처리 완료': '처리 완료로 바꿨어요.',
  무시: '무시로 처리했어요.',
};
const LONG = 80;

export default function ErrorCard({ error, onDone }: { error: AdminError; onDone: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState('');

  const kind = error.isPayment ? 'payment' : error.type;
  const long = error.textareaValue.length > LONG;

  const change = async (status: ErrorStatus) => {
    setSending(true);
    setFail('');
    try {
      await setErrorStatus(error._id, status);
      onDone(DONE_MESSAGE[status]);
    } catch (e) {
      setFail(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <article className={error.isPayment && error.status === '접수' ? `${s.card} ${s.cardPayment}` : s.card}>
      <div className={s.head}>
        <span className={s.typeTag[kind]}>{TYPE_LABEL[kind]}</span>
        <span className={s.date}>{error.created_at ? toKoreaTime(error.created_at).format('YYYY.MM.DD HH:mm') : ''}</span>
        <code className={s.path}>{error.pathname}</code>
        <span className={s.statusTag[error.status]}>{error.status}</span>
      </div>

      <div className={s.body}>
        <p className={`${s.message} ${error.type === 'system' ? s.messageCode : ''} ${long && !open ? s.clamp : ''}`}>
          {error.textareaValue}
        </p>
        {long && (
          <button type='button' aria-expanded={open} className={s.toggle} onClick={() => setOpen(!open)}>
            {open ? '접기' : '전체 보기'}
          </button>
        )}
      </div>

      {error.status === '접수' ? (
        <div className={s.foot}>
          <button type='button' className={s.ghostBtn} disabled={sending} onClick={() => change('무시')}>
            무시
          </button>
          <button type='button' className={s.primaryBtn} disabled={sending} onClick={() => change('처리 완료')}>
            처리 완료
          </button>
        </div>
      ) : (
        <div className={`${s.foot} ${s.footClosed}`}>
          <span className={s.muted}>{error.status === '처리 완료' ? '처리 완료한 기록이에요.' : '무시한 기록이에요.'}</span>
          <button type='button' className={s.ghostBtn} disabled={sending} onClick={() => change('접수')}>
            접수로 되돌리기
          </button>
        </div>
      )}

      {fail && (
        <p role='status' className={s.cardError}>
          {fail}
        </p>
      )}
    </article>
  );
}
