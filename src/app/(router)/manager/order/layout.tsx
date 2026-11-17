import React from 'react';
import * as s from './layout.css';
import { PageHeader } from '@/shared/ui';

export default function ManagerOrderLayout({ children, tab }: { children: React.ReactNode; tab: React.ReactNode }) {
  return (
    <div className={s.container}>
      <PageHeader
        eyebrow='ORDERS'
        title='주문 관리'
        description='결제된 주문을 확인하고 송장을 입력해 배송 상태를 바꿔요. 보낼 수 없는 주문은 사유를 적어 거절하면 환불돼요.'
      />
      {tab}
      {children}
    </div>
  );
}
