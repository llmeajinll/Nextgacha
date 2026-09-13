'use client';
import React from 'react';
import { useSplitRoute as useSpliteRoute } from '@/shared/hooks';
import useGetNotice from '@/entities/notice/model/useGetNotice';
import { Range } from '@/shared/ui';
import Link from 'next/link';
import Image from 'next/image';
import {
  container,
  backLink,
  backArrow,
  titleRow,
  num,
  title,
  createdAt,
  divider,
  content,
  contentList,
  navRow,
  navLink,
  navLinkNext,
  navIconLeft,
  navIconRight,
} from './noticeDetailPage.css';

export default function NoticeDetailPage() {
  const { secondRoute } = useSpliteRoute();
  const { result, count } = useGetNotice({ num: Number(secondRoute) });

  const notice = () => {
    // console.log('secondRoute', secondRoute);
    if (secondRoute === '%EA%B3%B5%EC%A7%80')
      return {
        num: '공지',
        title: '넥스트가챠 사용 안내',
        created_at: '2025-08-10 12:00:00',
        content:
          '넥스트 가챠는 되팔이 방지를 위해 한번에 5개까지만 구매할 수 있고, 배송이 완료되기 전까지 같은 제품을 구매할 수 없는 구조로 되어있습니다.\n우리 모두 행복한 덕질 생활을 위한 정책이므로 양해부탁드리겠습니다.\n적립포인트는 택배 배송 완료 후 적립될 예정입니다.\n5만원 이상 구매 시 배송비가 무료입니다. 또한, 구매 후 7일 이내에 반품 및 교환이 가능합니다.\n현재 보안을 위해 로그인은 카카오, 구매는 토스페이를 통해서만 가능합니다.\n신상 가챠는 매월 1일에 예약 가챠는 매월 12일에 추가됩니다만, 깜짝 추가 가챠가 들어올 수 있습니다.\n앞으로도 더 나은 서비스로 찾아뵙겠습니다. 감사합니다!',
      };
  };

  const prevNavigation = () => {
    if (secondRoute === '%EA%B3%B5%EC%A7%80') {
      return '';
    } else if (secondRoute === '1') {
      return `/notice/%EA%B3%B5%EC%A7%80`;
    } else {
      return `/notice/${Number(secondRoute) - 1}`;
    }
  };

  const nextNavigation = () => {
    if (secondRoute === '%EA%B3%B5%EC%A7%80') {
      return `/notice/${count}`;
    } else if (secondRoute === count.toString()) {
      return '';
    } else {
      return `/notice/${Number(secondRoute) + 1}`;
    }
  };

  const res = result ?? notice();

  // console.log('res', res);
  return (
    <Range preset='columnBetween' width='full' className={container}>
      <Link href='/notice' className={backLink}>
        <span className={backArrow}>{'<< '}</span>NOTICE
      </Link>

      <Range preset='between' width='full' className={titleRow}>
        <div>
          <span className={num}>{res?.num}.</span>
          <span className={title}>{res?.title}</span>
        </div>
        <div className={createdAt}>{res?.created_at}</div>
      </Range>
      <div className={divider}></div>
      <Range preset='column' width='full' className={content}>
        <div>{res?.content}</div>
        {Array.isArray((res as any).list) && (
          <div className={contentList}>
            {(res as any).list.map((val: string, idx: number) => (
              <div key={idx}>{val}</div>
            ))}
          </div>
        )}
      </Range>

      <div className={divider}></div>
      <Range preset='between' width='full' className={navRow}>
        {!(secondRoute === '%EA%B3%B5%EC%A7%80') && (
          <Link href={prevNavigation()} className={navLink}>
            <Image
              src='/images/Group 248.png'
              alt='left_arrow'
              width={16}
              height={16}
              className={navIconLeft}
            ></Image>
            PREV
          </Link>
        )}
        {!(secondRoute === count.toString()) && (
          <Link href={nextNavigation()} className={navLinkNext}>
            NEXT
            <Image
              src='/images/Group 248.png'
              alt='left_arrow'
              width={16}
              height={16}
              className={navIconRight}
            ></Image>
          </Link>
        )}
      </Range>
    </Range>
  );
}
