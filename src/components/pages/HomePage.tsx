'use client';

import React from 'react';
import { Banner } from '../organisms';
import { CardTemplate } from '../templates';
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
        <Title text='인기 상품' />
        <CardTemplate tag='hot' />
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', detail: '인기 상품' }}
        />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='신규 상품' />
        <CardTemplate tag='new' />
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', detail: '신규 상품' }}
        />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='예약 판매' />
        <CardTemplate tag='reserve' />
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', detail: '예약 판매' }}
        />
      </div>
    </>
  );
}
