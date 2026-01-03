'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Range } from '@/components/atoms';
import { useModal } from '@/app/hooks';

export default function page() {
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
      const addedPoint = localStorage.getItem('add_point');
      const list = JSON.parse(savedItems || '');
      const address = JSON.parse(savedAddress || '');
      const usedPoint = JSON.parse(savedUsedPoint || '0');
      const addPoint = JSON.parse(addedPoint || '0');

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
            address,
            usedPoint,
            addPoint,
          }),
        });
        console.log('response : ', response);
        const result = await response.json();
        console.log(result.data);
        if (result.ok) {
          // 3. 결제 최종 완료!
          setResult(result.data);
          setIsProcessing(false);
        } else {
          // 결제 실패 처리 (예: 잔액 부족 등)
          // alert(`${result.message}`);
          openModal(`${result.message}`);

          router.push(`/fail?message=${result.message}`);
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
      <h3>주문 번호: {orderId}</h3>
      <div>배송지: {result?.address}</div>
      <div>결제 금액: {result?.amount}원</div>
      <div>
        주문 상품:{' '}
        {result?.list.map((value: any, index: number) => (
          <div key={index}>
            <div>{value.title}</div>
            {value.product.map((val: any, idx: number) => (
              <div key={idx} style={{ marginLeft: '15px' }}>
                {val.name} : {val.count}개
              </div>
            ))}
          </div>
        ))}
      </div>
      <Range gap='30'>
        <Link href='/' style={{ fontFamily: 'silkscreen' }}>
          HOME
        </Link>
        <Link href='/mypage/history' style={{ fontFamily: 'silkscreen' }}>
          MYPAGE
        </Link>
      </Range>
    </div>
  );
}
