'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const [sendList, setsendList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function confirmPayment() {
      const savedItems = localStorage.getItem('pending_order_items');
      const list = JSON.parse(savedItems || '');
      if (!savedItems) return;

      // const list = JSON.parse(savedItems);
      setsendList(list);
      // console.log('list : ', list);
      try {
        // 2. 백엔드 API 호출 (승인 요청)
        const response = await fetch('/api/postPaymentsConfirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
            list,
          }),
        });
        // console.log('response : ', response);
        if (response.ok) {
          // 3. 결제 최종 완료!

          setIsProcessing(false);
        } else {
          // 결제 실패 처리 (예: 잔액 부족 등)
          const error = await response.json();
          alert('error');
          router.push(`/fail?message=${error.message}`);
        }
      } catch (err) {
        console.error('승인 중 오류 발생:', err);
      }
    }

    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount]);

  if (isProcessing)
    return <div>결제 승인 중입니다. 잠시만 기다려주세요...</div>;

  return (
    <div>
      <h1>결제가 완료되었습니다!</h1>
      <div>주문 번호: {orderId}</div>
      <div>
        주문 상품:{' '}
        {sendList.map((value: any, index: number) => (
          <div key={index}>
            {value.product.map((val: any, idx: number) => (
              <div key={idx}>
                {val.name} : {val.count}개
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>결제 금액: {Number(amount).toLocaleString()}원</div>
    </div>
  );
}
