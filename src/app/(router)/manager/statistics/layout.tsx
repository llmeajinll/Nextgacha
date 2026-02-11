'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Btn, Range } from '@/components/atoms';
import { useSpliteRoute } from '@/app/hooks';

export default function layout({ menu }: { menu: React.ReactNode }) {
  const router = useRouter();
  const { route } = useSpliteRoute();

  return (
    <div>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>통계 조회</h1>
      <Range>
        <Btn
          color={`${route[2] === 'search' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            router.push('/manager/statistics/search');
          }}
        >
          검색 결과
        </Btn>
        <Btn
          color={`${route[2] === 'num' ? 'primary' : 'reversePrimary'}`}
          onClick={() => {
            router.push('/manager/statistics/num');
          }}
        >
          NUM 조회
        </Btn>
      </Range>
      {menu}
    </div>
  );
}
