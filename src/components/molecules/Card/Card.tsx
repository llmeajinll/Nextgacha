'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { HeartBtn, Tag } from '@/components/atoms';
import { TagContainer } from '@/components/molecules';
import {
  cardContainer,
  cardImage,
  infoContainer,
  // TagContainer,
  cardTitle,
  bottomContainer,
} from './card.css';
import { CardProps } from '@/shared/type';
import { comma } from '@/shared/comma';

export default function Card({ props }: { props: CardProps }) {
  const [like, setLike] = useState(false);
  useEffect(() => {
    // console.log('Card props:', props);
    const raw = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userInfo='))
      ?.split('=')[1];

    const userInfo = raw ? JSON.parse(decodeURIComponent(raw)) : null;

    if (userInfo && userInfo.like) {
      console.log('userInfo.like:', userInfo.like, 'props.num:', props.num);
      setLike(userInfo.like.includes(props.num));
    }
  }, []);
  return (
    <div className={cardContainer}>
      <Link href={`/${props.group[0] || null}${props.num}/info`}>
        <Image
          src={
            props.image[0] ? String(props.image[0]) : '/images/defaultImg.png'
          }
          height={300}
          width={300}
          alt='img'
          className={cardImage}
        />
      </Link>
      <div className={infoContainer}>
        <TagContainer
          create={props?.create || ''}
          reserve={props?.reserve || ''}
        />
        <div className={cardTitle}>{props.title}</div>

        <div className={bottomContainer}>
          <div>
            {comma(props.price)}
            <span style={{ fontSize: '18px' }}> 원</span>
          </div>
          <HeartBtn status={like} />
        </div>
      </div>
    </div>
  );
}
