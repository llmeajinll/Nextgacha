'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import postLike from '@/api/postLike';
import Cookies from 'js-cookie';

export default function HeartBtn({
  size = 28,
  status,
  isLogin,
  num,
}: {
  size?: number;
  status?: boolean;
  isLogin: boolean;
  num: number;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}) {
  console.log(num, status);
  const [like, setLike] = useState(status);

  useEffect(() => {
    setLike(status);
  }, [num, status]);

  const imgurl = ['/images/heart1.png', '/images/heart2.png'];

  const onClickHeartBtn = async () => {
    if (isLogin) {
      try {
        const result = await postLike({ num });
        const json = await result?.json();
        setLike(json.like);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('로그인 후 사용할 수 있습니다');
    }
  };

  return (
    <Image
      src={like ? imgurl[1] : imgurl[0]}
      width={size * 1.07 || 30}
      height={size || 28}
      alt='like'
      onClick={onClickHeartBtn}
      style={{ cursor: 'pointer' }}
    ></Image>
  );
}
