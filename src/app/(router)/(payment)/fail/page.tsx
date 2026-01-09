'use client';

import React from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { Range } from '@/components/atoms';

export default function page() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div
      style={{
        width: '900px',
        padding: '10px 30px 40px 30px',
        margin: '40px auto 0 auto',
        border: '4px solid #75C3FE',
      }}
    >
      <h1 style={{ color: '#3AAAFF' }}>
        결제 과정에서 오류가 발생하였습니다 :{'('}
      </h1>
      <div style={{ fontSize: '18px', color: '#6F6F6F', marginBottom: '40px' }}>
        {message}
      </div>
      <Range gap='50' style={{ margin: '30px auto 0 auto' }}>
        <Link href='/' style={{ fontFamily: 'silkscreen' }}>
          HOME
        </Link>
        <Link href='/mypage/history' style={{ fontFamily: 'silkscreen' }}>
          MYPAGE
        </Link>
      </Range>
    </div>
  );
}
