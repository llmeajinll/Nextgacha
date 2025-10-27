'use client';

import Image from 'next/image';
import React from 'react';
import { HeartBtn, Tag } from '@/components/atoms';
import {
  cardContainer,
  cardImage,
  infoContainer,
  TagContainer,
  cardTitle,
  bottomContainer,
} from './card.css';
import Link from 'next/link';
import { CardProps } from '@/shared/type';
import { comma } from '@/shared/comma';

export default function Card({ props }: { props: CardProps }) {
  return (
    <div className={cardContainer}>
      <Link href={`/${props.group[0]}${props.num}/info`}>
        <Image
          src={String(props.image[0])}
          height={300}
          width={300}
          alt='img'
          className={cardImage}
        />
      </Link>
      <div className={infoContainer}>
        <div className={TagContainer}>
          <Tag word='2025년 12월 예약' color='#BCE2FF' />
          <Tag word='HOT' color='#FFA5A5' />
          <Tag word='NEW' color='#FFDFAB' />
          {/* <Tag word='SOLD OUT' color='#DCDCDC' /> */}
        </div>

        <div className={cardTitle}>{props.title}</div>

        <div className={bottomContainer}>
          <div>
            {comma(props.price)}
            <span style={{ fontSize: '18px' }}> 원</span>
          </div>
          <HeartBtn />
        </div>
      </div>
    </div>
  );
}
