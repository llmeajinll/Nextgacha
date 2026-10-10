'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { Range } from '@/shared/ui';
import { useModal } from '@/shared/hooks';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const [sendList, setsendList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<any>(null);
  const { openModal } = useModal();

  useEffect(() => {
    async function confirmPayment() {
      const savedItems = localStorage.getItem('pending_order_items');
      const savedAddress = localStorage.getItem('address');
      const savedUsedPoint = localStorage.getItem('used_point');
      if (!savedItems) {
        router.push('/fail?message=' + encodeURIComponent('주문 정보를 찾을 수 없습니다.'));
        return;
      }
      const list = JSON.parse(savedItems);
      const address = JSON.parse(savedAddress || '""');
      const usedPoint = JSON.parse(savedUsedPoint || '0');

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
            address,
            usedPoint,
          }),
        });
        console.log('response : ', response);
        const result = await response.json();
        console.log(result.data);
        if (result.ok) {
          // 3. 결제 최종 완료!
          ['pending_order_items', 'address', 'used_point'].forEach((key) =>
            localStorage.removeItem(key),
          );
          setResult(result.data);
          setIsProcessing(false);
        } else {
          // 결제 실패 처리 (예: 잔액 부족 등)
          // alert(`${result.message}`);
          openModal(`${result.message}`);

          router.push(`/fail?message=${encodeURIComponent(result.message)}`);
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
  else {
    redirect(`/checkout/${orderId}`);
  }

  return <></>;
}
