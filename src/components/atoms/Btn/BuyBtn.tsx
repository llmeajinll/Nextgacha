'use client';

import React from 'react';
import Btn from './Btn';
import { useCallback } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/jotai/store';

interface BuyBtnType {
  // email: string;
  price: number;
  size?: 'big' | 'medium';
  list?: { num: number; product: { name: string; count: number }[] }[];
  usedPoint: number;
  addPoint: number;
}

export default function BuyBtn({ props }: { props: BuyBtnType }) {
  console.log('buyBtn list : ', props?.list);

  const [userInfo] = useAtom(userInfoAtom);

  const onClickPayment = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (props?.list?.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
      }

      if (userInfo?.address === '') {
        alert('배송지를 입력해주세요.');
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
        localStorage.setItem('address', JSON.stringify(userInfo?.address));
        localStorage.setItem('used_point', JSON.stringify(props.usedPoint));
        localStorage.setItem('add_point', JSON.stringify(props.addPoint));
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
    [props, userInfo]
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
