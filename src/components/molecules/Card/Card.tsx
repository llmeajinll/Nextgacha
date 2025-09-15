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

export default function Card({ id }: { id?: string }) {
  return (
    <div className={cardContainer}>
      <Link href={`/${id}`}>
        <Image
          src='/images/image 23.png'
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

        <div className={cardTitle}>
          치이카와 우물우물파티 3탄 캡슐토이 가챠 치이카와 우물우물파티 3탄
          캡슐토이 가챠 치이카와 우물우물파티 3탄 캡슐토이 가챠
        </div>

        <div className={bottomContainer}>
          <div>
            4‚000<span style={{ fontSize: '18px' }}> 원</span>
          </div>
          <HeartBtn />
        </div>
      </div>
    </div>
  );
}
