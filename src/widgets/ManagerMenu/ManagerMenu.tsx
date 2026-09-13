import Link from 'next/link';
import React from 'react';
import { firstItem } from './managerMenu.css';

export default function ManagerMenu() {
  return (
    <div>
      <div className={firstItem}>
        <Link href='/manager/user'>1. 회원 관리</Link>
      </div>
      <div>
        <Link href='/manager/product_add'>2. 상품 추가</Link>
      </div>
      <div>
        <Link href='/manager/product_manage'>3. 상품 관리</Link>
      </div>
      <div>
        <Link href='/manager/order/check'>4. 주문 관리</Link>
      </div>
      <div>
        <Link href='/manager/event'>5. 이벤트 관리</Link>
      </div>
      <div>
        <Link href='/manager/statistics/search'>6. 통계</Link>
      </div>
      <div>
        <Link href='/manager/error'>7. 오류 신고 수집</Link>
      </div>
    </div>
  );
}
