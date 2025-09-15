'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function HeartBtn({ size = 28 }: { size?: number }) {
  const [liked, setLiked] = useState(false);

  const imgurl = ['/images/heart1.png', '/images/heart2.png'];
  return (
    <Image
      src={liked ? imgurl[1] : imgurl[0]}
      width={size * 1.07 || 30}
      height={size || 28}
      alt='like'
      onClick={() => setLiked(!liked)}
      style={{ cursor: 'pointer' }}
    ></Image>
  );
}
