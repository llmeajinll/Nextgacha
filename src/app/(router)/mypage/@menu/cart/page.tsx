'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { EmptyCard } from '@/shared/ui';

// 장바구니는 로그인 쿠키로 /api/getCart를 불러와야 해서 브라우저에서만 그린다.
// 서버 렌더링 때 useSuspenseQuery가 상대 주소 fetch를 시도하면 "Failed to parse URL"로 실패한다
const CartTemplate = dynamic(() => import('@/widgets/CartTemplate/CartTemplate'), {
  ssr: false,
  loading: () => <EmptyCard>CART LOADING...</EmptyCard>,
});

export default function Page() {
  // 컴포넌트를 받은 뒤 장바구니 데이터를 기다리는 동안(useSuspenseQuery)에도 같은 문구를 보여준다
  return (
    <Suspense fallback={<EmptyCard>CART LOADING...</EmptyCard>}>
      <CartTemplate />
    </Suspense>
  );
}
