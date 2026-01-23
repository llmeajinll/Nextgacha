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
  const ShowPrice = (props: {
    price: number;
    isDiscount: boolean;
    discount: number;
  }) => {
    const { price, isDiscount, discount } = props;
    if (isDiscount === true && discount !== 0) {
      return (
        <>
          <span
            style={{
              color: '#75C3FE',
              fontSize: '20px',
              marginRight: '5px',
              fontWeight: '500',
            }}
          >
            {discount}%
          </span>
          <span
            style={{
              color: 'lightgray',
              textDecoration: 'line-through',
              fontSize: '20px',
            }}
          >
            {comma(price)}
          </span>
          <span style={{ margin: '0 5px' }}>→ </span>
          <span>{comma(price * (1 - discount / 100))}</span>
        </>
      );
    } else {
      return <span>{comma(price)}</span>;
    }
  };

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
        <div>
          <div className={cardTitle}>{props.title}</div>

          <div className={bottomContainer}>
            <div>
              <ShowPrice
                price={props.price}
                isDiscount={props.isDiscount}
                discount={props.discount}
              />
              <span style={{ fontSize: '18px' }}> 원</span>
            </div>
            <HeartBtn status={props.like} num={props.num} />
          </div>
        </div>
      </div>
    </div>
  );
}
