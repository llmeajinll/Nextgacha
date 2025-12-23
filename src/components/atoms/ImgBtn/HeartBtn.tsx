'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import updateLike from '@/api/updateLike';
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
  console.log(num, status, isLogin);
  const [like, setLike] = useState(status);

  useEffect(() => {
    setLike(status);
  }, [num, status, isLogin]);

  const imgurl = ['/images/heart1.png', '/images/heart2.png'];

  const onClickHeartBtn = async () => {
    await fetch('/api/protected/updateLike', {
      method: 'POST',
      body: JSON.stringify(num),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        console.log('heart button update : ', data);
        if (data.ok === true) {
          setLike(data.result);
        } else {
          alert('로그인 후 좋아요를 누를 수 있습니다.');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('로그인 후 좋아요를 누를 수 있습니다.');
      });
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
