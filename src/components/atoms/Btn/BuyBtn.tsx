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
}

export default function BuyBtn({ props }: { props: BuyBtnType }) {
  const tossPaymentsRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  console.log(props);

  useEffect(() => {
    // async function init() {
    //   try {
    //     const tossPayments = await loadTossPayments(
    //       //   'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
    //       process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY || ''
    //     );
    //     tossPaymentsRef.current = tossPayments.payment({
    //       customerKey: uuidv4(),
    //     });
    //     setReady(true);
    //   } catch (e) {
    //     console.log('tosspayment sdk load fail : ', e);
    //   }
    // }
    // init();
  }, [props.price]);

  const onClickPayment = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const tossPayments = await loadTossPayments(
        // 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
        process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY || ''
      );
      const payment = tossPayments.payment({
        customerKey: uuidv4(),
      });
      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: props.price,
        },
        orderId: `order_${Date.now()}`,
        orderName: '상품 결제',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        // windowTarget: 'popup',
      });

      // const widgets = (await tossPayments).widgets();
      //   if (!tossPaymentsRef.current || !ready) {
      //     alert('결제 UI가 아직 준비되지 않았습니다.');
      //     return;
      //   }

      // if (props.email === '' || undefined || null) {
      //   alert('로그인 후 결재해주세요.');
      //   return;
      // }

      //   if (props.price === 0) {
      //     alert('0월은 결재할 수 없습니다.');
      //     return;
      //   }

      //   await tossPaymentsRef.current?.requestPayment({
      //     orderId: `order_${Date.now()}`,
      //     orderName: 'NEXT GACHA 결제',
      //     amount: { currency: 'KRW', value: props.price },
      //     successUrl: `${window.location.origin}/success`,
      //     failUrl: `${window.location.origin}/fail`,
      //     windowTarget: 'window',
      //     customerEmail: uuidv4(),
      //   });
    },
    [ready, props]
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
