'use client';

import React from 'react';
import Image from 'next/image';
import { useSpliteRoute } from '@/app/hooks';

export default function InfoTab() {
  console.log('InfoTab');
  const { firstRoute } = useSpliteRoute();
  const src = firstRoute
    ? `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}/${firstRoute}_info.png`
    : '/images/defaultImg.png';

  console.log(src, process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL);
  return (
    <div>
      <Image
        src={
          firstRoute
            ? `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${firstRoute}_info.png`
            : '/images/defaultImg.png'
        }
        alt='Info image'
        width={958}
        height={960}
      />
      <div>가챠에 한 캐릭터 당 최대 5개까지 장바구니에 담을 수 있습니다.</div>
      <div>
        T의 A캐릭터가 장바구니에 2개 담겨 있으면 T시리즈의 A 캐릭터는 3개 더
        담을 수 있고, K의 A캐릭터는 5개 담을 수 있습니다.
      </div>
    </div>
  );
}
