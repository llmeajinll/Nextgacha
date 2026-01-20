import Link from 'next/link';
import React from 'react';

export default function page() {
  return (
    <div style={{ padding: '30px' }}>
      <input />
      <input />
      <div>
        <Link href='/manager/product'>상품 추가</Link>
      </div>
      <div>
        <Link href='/manager/order/check'>주문 관리</Link>
      </div>
    </div>
  );
}
