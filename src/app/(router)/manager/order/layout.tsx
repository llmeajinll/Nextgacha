import React from 'react';
import * as s from './layout.css';

export default function ManagerOrderLayout({ children, tab }: { children: React.ReactNode; tab: React.ReactNode }) {
  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>ORDERS</span>
        <h1 className={s.title}>주문 관리</h1>
        <p className={s.subText}>
          결제된 주문을 확인하고 송장을 입력해 배송 상태를 바꿔요. 보낼 수 없는 주문은 사유를 적어 거절하면 환불돼요.
        </p>
      </section>
      {tab}
      {children}
    </div>
  );
}
