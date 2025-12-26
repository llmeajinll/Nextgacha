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
import Cookies from 'js-cookie';

export default function Card({ props }: { props: CardProps }) {
  // const [like, setLike] = useState(false);
  console.log(props);
  // const userCookie = Cookies.get('userInfo');
  // let userInfo = null;
  // let isLogin = false;

  // if (userCookie) {
  //   try {
  //     userInfo = JSON.parse(userCookie);
  //     isLogin = userInfo?.email ? true : false;
  //     console.log(isLogin);
  //   } catch (err) {
  //     console.error('userInfo parse error:', err);
  //   }
  // }
  return (
    <div className={cardContainer}>
      <Link href={`/${props.num || 0}/info`}>
        <Image
          src={
            props?.image.length === 0
              ? '/images/defaultImg.png'
              : String(props.image[0])
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
          <HeartBtn status={props.like} num={props.num} />
        </div>
      </div>
    </div>
  );
}
