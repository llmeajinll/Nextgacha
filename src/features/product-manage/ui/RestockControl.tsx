'use client';

import { useState } from 'react';
import { Btn } from '@/shared/ui';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import type { CardProps } from '@/entities/product/model/types';
import postRestock from '../api/postRestock';
import * as s from './productManageRow.css';

// 품절 상품의 재입고 예정 시각(정시 단위). 저장하면 재입고 알림 신청자에게 사이트 알림이 간다
export default function RestockControl({ product }: { product: CardProps }) {
  const [at, setAt] = useState(product.restockAt ? toKoreaTime(product.restockAt).format('YYYY-MM-DDTHH:00') : '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (product.reserve || product.list.some((o) => o.count > 0)) return null;

  const save = async () => {
    setSending(true);
    try {
      const { notified } = await postRestock(product.num, at);
      setMessage(`저장했어요. 알림 신청자 ${notified}명에게 알렸어요.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={s.field}>
      <label htmlFor={`pm-restock-${product.num}`} className={s.label}>
        재입고 예정 <span className={s.hint}>정시 단위 · 저장하면 알림 신청자에게 알려요</span>
      </label>
      <div className={s.unitRow}>
        <input
          id={`pm-restock-${product.num}`}
          type='datetime-local'
          step={3600}
          value={at}
          onChange={(e) => setAt(e.target.value)}
          className={s.input}
        />
        <Btn kind='secondary' disabled={!at || sending} onClick={save}>
          {sending ? '알리는 중…' : '예정 알리기'}
        </Btn>
      </div>
      {message && (
        <span role='status' className={s.hint}>
          {message}
        </span>
      )}
    </div>
  );
}
