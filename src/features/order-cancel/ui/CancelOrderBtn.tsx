'use client';

import { useState } from 'react';
import { Btn } from '@/shared/ui';
import { useModal } from '@/shared/hooks';
import cancelOrder from '../api/cancelOrder';
import { cancelBtn } from './cancelOrderBtn.css';

// 상품 확인중 주문에만 보여준다 (배송중 이후는 취소 불가)
export default function CancelOrderBtn({ orderId, onCanceled }: { orderId: string; onCanceled: () => void }) {
  const { openModal } = useModal();
  const [sending, setSending] = useState(false);

  const run = async () => {
    setSending(true);
    try {
      await cancelOrder(orderId);
      openModal('주문을 취소했습니다. 결제 금액과 사용한 포인트가 돌아갑니다.');
      onCanceled();
    } catch (e) {
      openModal(e instanceof Error ? e.message : '주문을 취소하지 못했습니다.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Btn
      kind='dangerLine'
      scale='s'
      className={cancelBtn}
      disabled={sending}
      onClick={() => openModal('이 주문을 취소할까요? 송장이 입력되기 전까지만 취소할 수 있습니다.', {
          onClickCheck: run,
          // 있어야 YES/NO 두 버튼이 뜬다
          onClickCancel: () => {},
        })}
    >
      {sending ? '취소하는 중…' : '주문 취소'}
    </Btn>
  );
}
