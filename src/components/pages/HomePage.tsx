import React from 'react';
import { Banner, CardTemplate } from '@/components/organisms';
import { Btn, MoreBtn, Title } from '../atoms';

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
        <MoreBtn />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '20px',
        }}
      >
        <Title text='인기 상품' />
        <CardTemplate />
        <MoreBtn />
      </div>
    </>
  );
}
