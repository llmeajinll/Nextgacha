'use client';

import { useState } from 'react';
import { Btn } from '@/shared/ui';
import { useModal } from '@/shared/hooks';
import { cancelBtn } from './cancelOrderBtn.css';

// 배송 완료 주문에만 보여준다. 배송 후에는 환불 없이 불량품 교환만 한다 (docs/policies/refunds.md)
export default function ExchangeRequestBtn({ orderId, onRequested }: { orderId: string; onRequested: () => void }) {
  const { openModal } = useModal();
  const [sending, setSending] = useState(false);

  const request = async () => {
    // ponytail: 브라우저 기본 입력창. 사진 첨부나 상품별 선택이 필요해지면 전용 모달로
    const reason = window.prompt('불량 내용을 10자 이상 적어 주세요. 확인 후 같은 상품을 다시 보내드립니다.')?.trim();
    if (reason === undefined) return;
    if (reason.length < 10) return openModal('불량 내용을 10자 이상 적어 주세요.');
    setSending(true);
    try {
      const res = await fetch('/api/protected/postExchangeRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return openModal(data.message ?? '교환을 요청하지 못했습니다.');
      openModal('교환을 요청했습니다. 처리되면 알림으로 알려드립니다.');
      onRequested();
    } finally {
      setSending(false);
    }
  };

  return (
    <Btn kind='neutral' scale='s' className={cancelBtn} disabled={sending} onClick={request}>
      {sending ? '요청하는 중…' : '불량 교환 요청'}
    </Btn>
  );
}
