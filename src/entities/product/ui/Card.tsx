'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ImgBtn, Tag } from '@/shared/ui';
import HeartBtn from './HeartBtn';
import { TagContainer } from '@/entities/product/ui';
import {
  cardContainer,
  cardImage,
  infoContainer,
  // TagContainer,
  cardTitle,
  bottomContainer,
  discountBadge,
  originalPrice,
  arrow,
  unit,
} from './card.css';
import { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import Cookies from 'js-cookie';

function ShowPrice(props: {
  price: number;
  isDiscount: boolean;
  discount: number;
}) {
  const { price, isDiscount, discount } = props;
  if (isDiscount === true && discount !== 0) {
    return (
      <>
        <span className={discountBadge}>{discount}%</span>
        <span className={originalPrice}>{comma(price)}</span>
        <span className={arrow}>→ </span>
        <span>{comma(price * (1 - discount / 100))}</span>
      </>
    );
  } else {
    return <span>{comma(price)}</span>;
  }
}

// preview: 관리자 상품 추가 화면의 미리보기. 링크를 끄고 좋아요 버튼은 모양만 보임
export default function Card({ props, preview }: { props: CardProps; preview?: boolean }) {
  const image = (
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
  );

  return (
    <div className={cardContainer}>
      {preview ? image : <Link href={`/${props.num || 0}/info`}>{image}</Link>}
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
              <span className={unit}> 원</span>
            </div>
            {preview ? (
              <ImgBtn img='heart' size={28} title='좋아요' active={false} disabled />
            ) : (
              <HeartBtn status={props.like} num={props.num} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
