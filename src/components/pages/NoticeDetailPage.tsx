'use client';
import React from 'react';
import { useSpliteRoute, useGetNotice } from '@/app/hooks';
import { Range } from '@/components/atoms';
import Link from 'next/link';
import Image from 'next/image';

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
    <Range
      preset='columnBetween'
      width='full'
      style={{
        boxSizing: 'border-box',
        borderBottom: '1px solid lightgray',
        borderRight: '1px solid lightgray',
        borderLeft: '1px solid lightgray',
        padding: '20px 50px',
      }}
    >
      <Link
        href='/notice'
        style={{
          fontFamily: 'silkscreen',
          fontSize: '14px',
          lineHeight: '24px',
        }}
      >
        <span style={{ color: '#75c3fe' }}>{'<< '}</span>NOTICE
      </Link>

      <Range
        preset='between'
        width='full'
        style={{ boxSizing: 'border-box', padding: '20px 20px 10px 20px' }}
      >
        <div>
          <span
            style={{
              fontFamily: 'silkscreen',
              marginRight: '5px',
              fontSize: '18px',
            }}
          >
            {res?.num}.
          </span>
          <span style={{ lineHeight: '14px', fontFamily: 'silkscreen' }}>
            {res?.title}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'silkscreen',
            fontSize: '14px',
            lineHeight: '24px',
          }}
        >
          {res?.created_at}
        </div>
      </Range>
      <div
        style={{ width: '100%', height: '1px', backgroundColor: 'lightgray' }}
      ></div>
      <Range
        preset='column'
        width='full'
        style={{
          boxSizing: 'border-box',
          padding: '20px',
          whiteSpace: 'pre-wrap',
          minHeight: '300px',
        }}
      >
        <div>{res?.content}</div>
        {Array.isArray((res as any).list) && (
          <div style={{ marginTop: '40px' }}>
            {(res as any).list.map((val: string, idx: number) => (
              <div key={idx}>{val}</div>
            ))}
          </div>
        )}
      </Range>

      <div
        style={{ width: '100%', height: '1px', backgroundColor: 'lightgray' }}
      ></div>
      <Range
        preset='between'
        width='full'
        style={{
          padding: '10px 20px',
          boxSizing: 'border-box',
          fontFamily: 'silkscreen',
        }}
      >
        {!(secondRoute === '%EA%B3%B5%EC%A7%80') && (
          <Link
            href={prevNavigation()}
            style={{ color: 'gray', display: 'flex', alignItems: 'center' }}
          >
            <Image
              src='/images/Group 248.png'
              alt='left_arrow'
              width={16}
              height={16}
              style={{ marginRight: '5px' }}
            ></Image>
            PREV
          </Link>
        )}
        {!(secondRoute === count.toString()) && (
          <Link
            href={nextNavigation()}
            style={{
              marginLeft: 'auto',
              color: 'gray',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            NEXT
            <Image
              src='/images/Group 248.png'
              alt='left_arrow'
              width={16}
              height={16}
              style={{ marginLeft: '5px', rotate: '180deg' }}
            ></Image>
          </Link>
        )}
      </Range>
    </Range>
  );
}
