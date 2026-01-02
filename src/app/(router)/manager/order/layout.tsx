'use client';

import React from 'react';
import { Btn, Range } from '@/components/atoms';
import { useSpliteRoute } from '@/app/hooks';

export default function ManagerOrderLayout({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: React.ReactNode;
}) {
  const { route } = useSpliteRoute();
  return (
    <div style={{ boxSizing: 'border-box', padding: '0px 20px' }}>
      <h1>주문 관리</h1>
      <Range>
        <Btn
          color={`${route[2] === 'check' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            window.location.href = '/manager/order/check';
          }}
        >
          상품 확인중
        </Btn>
        <Btn
          color={`${route[2] === 'sending' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            window.location.href = '/manager/order/sending';
          }}
        >
          배송중
        </Btn>
        <Btn
          color={`${route[2] === 'arrive' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            window.location.href = '/manager/order/arrive';
          }}
        >
          배송 완료
        </Btn>
        <Btn
          color={`${route[2] === 'refund' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            window.location.href = '/manager/order/refund';
          }}
        >
          환불
        </Btn>
      </Range>
      {tab}
      {children}
    </div>
  );
}
