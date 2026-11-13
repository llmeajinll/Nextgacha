'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ImgBtn } from '@/shared/ui';
import HeartBtn from './HeartBtn';
import TagContainer from './TagContainer';
import * as s from './card.css';
import { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';

function ShowPrice({ price, isDiscount, discount }: { price: number; isDiscount: boolean; discount: number }) {
  if (isDiscount && discount !== 0) {
    return (
      <>
        <span className={s.discountBadge}>{discount}%</span>
        <span className={s.originalPrice}>{comma(price)}</span>
        {comma(price * (1 - discount / 100))}
      </>
    );
  }
  return <>{comma(price)}</>;
}

// 디자인 캔버스 ShopHome의 상품 카드. 폭은 부모(그리드 칸)를 따른다
// preview: 관리자 상품 추가 화면의 미리보기. 링크를 끄고 좋아요 버튼은 모양만 보임
export default function Card({ props, preview }: { props: CardProps; preview?: boolean }) {
  const body = (
    <>
      <Image
        src={props?.image.length === 0 ? '/images/defaultImg.png' : String(props.image[0])}
        width={300}
        height={300}
        sizes='(max-width: 1023px) 156px, 300px'
        alt={`${props.title} 상품 이미지`}
        className={s.image}
      />
      <div className={s.info}>
        <TagContainer create={props?.create || ''} reserve={props?.reserve || ''} />
        <span className={s.title}>{props.title}</span>
      </div>
    </>
  );

  return (
    <article className={s.card}>
      {preview ? <div className={s.link}>{body}</div> : <Link href={`/${props.num || 0}/info`} className={s.link}>{body}</Link>}
      <div className={s.bottom}>
        <span className={s.price}>
          <ShowPrice price={props.price} isDiscount={props.isDiscount} discount={props.discount} />
          <span className={s.unit}> 원</span>
        </span>
        {preview ? (
          <ImgBtn img='heart' size={24} title='좋아요' active={false} disabled className={s.heart} />
        ) : (
          <HeartBtn size={24} status={props.like} num={props.num} className={s.heart} />
        )}
      </div>
    </article>
  );
}
