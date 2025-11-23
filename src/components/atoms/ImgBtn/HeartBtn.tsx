'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postLike from '@/api/postLike';
import Cookies from 'js-cookie';

export default function HeartBtn({
  size = 28,
  status,
  num,
}: {
  size?: number;
  status?: boolean;
  num: number;
}) {
  console.log('HeartBtn status:', status);
  const [liked, setLiked] = useState(status);

  const toggleLike = () => {
    const { like } = JSON.parse(Cookies.get('userInfo') || '');
    const updatedLikes = status
      ? like.filter((val: number) => val !== num)
      : [...like, num];

    // 쿠키에 즉시 반영
    Cookies.set('likes', JSON.stringify(updatedLikes), {
      path: '/',
    });
  };

  const imgurl = ['/images/heart1.png', '/images/heart2.png'];
  return (
    <Image
      src={liked ? imgurl[1] : imgurl[0]}
      width={size * 1.07 || 30}
      height={size || 28}
      alt='like'
      onClick={() => {
        const data = { status: !liked, num: num };
        postLike(data);
        setLiked(!liked);
      }}
      style={{ cursor: 'pointer' }}
    ></Image>
  );
}
