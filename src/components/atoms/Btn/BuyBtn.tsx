'use client';

import React from 'react';
import Btn from './Btn';
import { useState, useEffect, useRef, useCallback } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { v4 as uuidv4 } from 'uuid';

interface BuyBtnType {
  // email: string;
  price: number;
  size?: 'big' | 'medium';
  list?: { num: number; product: { name: string; count: number }[] };
}

export default function BuyBtn({ props }: { props: BuyBtnType }) {
  console.log('buyBtn list : ', props.list);

  const onClickPayment = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!props?.list) {
        alert('상품이 없습니다.');
        return;
      }

      const orderId = `order_${Date.now()}`;
      const customerKey = uuidv4();
      const result = await fetch('/api/postCheckStock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list: props.list }),
      }).then((res) => {
        return res.json();
      });

      if (result.ok !== true) {
        return;
      } else {
        // console.log('통과');
        localStorage.setItem('pending_order_items', JSON.stringify(props.list));
      }

      const tossPayments = await loadTossPayments(
        // 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
        process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY || ''
      );
      const payment = tossPayments.payment({
        customerKey: customerKey,
      });
      await payment
        .requestPayment({
          method: 'CARD',
          amount: {
            currency: 'KRW',
            value: props.price,
          },
          orderId: orderId,
          orderName: 'NextGacha 결재',
          successUrl: `${window.location.origin}/success`,
          failUrl: `${window.location.origin}/fail`,
          // windowTarget: 'popup',
        })
        .catch((err) => {
          console.log('err : ', err);
          alert('결재 취소');
        });
    },
    [props]
  );

  return (
    <>
      {/* {ready && <div id='payment-method' />} */}
      <Btn size={props.size || 'medium'} onClick={onClickPayment}>
        BUY
      </Btn>
    </>
  );
}
