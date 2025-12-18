'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useSpliteRoute } from '@/app/hooks';

export default function InfoTab() {
  console.log('InfoTab');
  const { firstRoute } = useSpliteRoute();
  const src = firstRoute
    ? `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}/${firstRoute}_info.png`
    : '/images/defaultImg.png';

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
      <div>한 캐릭터 당 최대 5개까지 장바구니에 담을 수 있습니다.</div>
    </div>
  );
}
