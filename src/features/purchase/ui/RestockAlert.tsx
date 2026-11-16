'use client';

import { useState } from 'react';
import { Btn } from '@/shared/ui';
import { useModal } from '@/shared/hooks';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import type { CardProps } from '@/entities/product/model/types';
import { box, text } from './restockAlert.css';

// 품절(모든 옵션 재고 0) 상품에만 보인다. 신청하면 재입고 예정·재입고 때 사이트 알림(헤더 종)을 받는다
export default function RestockAlert({ product }: { product: CardProps }) {
  const { openModal } = useModal();
  const [requested, setRequested] = useState(!!product.restockRequested);
  const [sending, setSending] = useState(false);

  if (!product.list?.length || product.list.some((o) => o.count > 0)) return null;

  const request = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/protected/postRestockAlert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num: product.num }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) return openModal('로그인 후 신청할 수 있습니다.');
      if (!res.ok || !data.ok) return openModal(data.message ?? '신청하지 못했습니다.');
      setRequested(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={box}>
      <span className={text}>
        {product.restockAt
          ? `${toKoreaTime(product.restockAt).format('YYYY.MM.DD HH:00')} 재입고 예정`
          : '품절된 상품입니다.'}
      </span>
      <Btn kind='secondary' scale='s' disabled={requested || sending} onClick={request}>
        {requested ? '재입고 알림 신청됨' : '재입고 알림 받기'}
      </Btn>
    </div>
  );
}
