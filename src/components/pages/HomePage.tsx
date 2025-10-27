'use client';

import React, { use, useEffect } from 'react';
import { Banner, CardTemplate } from '@/components/organisms';
import { Btn, Title } from '../atoms';

export default function HomePage() {

  return (
    <>
      <Banner />
      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='예약 판매' />
        <CardTemplate />
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', detail: '예약 판매' }}
        />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '20px',
        }}
      >
        <Title text='인기 상품' />
        <CardTemplate />
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', detail: '인기 상품' }}
        />
      </div>
    </>
  );
}
