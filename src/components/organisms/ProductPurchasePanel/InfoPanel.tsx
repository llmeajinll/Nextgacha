'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';

import { useAtom } from 'jotai';
import { tempCartAtom } from '@/jotai/store';

import { Btn, HeartBtn, ImgBtn, ReactSlick, Range } from '@/components/atoms';
import { DropDown, LabelTitle } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import { comma } from '@/shared/comma';

import { panelTitle } from './productPurchasePanel.css';
import { postCart } from '@/api/postCart';
import dayjs from 'dayjs';

export default function InfoPanel({ props }: { props: CardProps }) {
  console.log('infopanel', props);
  const [tempCart] = useAtom(tempCartAtom);
  const [like, setLike] = useState(false);
  let userInfo: { email: string } | null = null;

  useEffect(() => {
    const data = JSON.parse(Cookies.get('userInfo') || '');
    userInfo = data;
    // setLike(data.includes(props.num));
  }, []);

  return (
    <Range
      width='960'
      gap='30'
      style={{
        marginBottom: '60px',
      }}
    >
      <div>
        {props?.image?.length ? (
          <ReactSlick image={props?.image} preset='small' />
        ) : (
          <Image
            src='/images/defaultImg.png'
            alt='image'
            width={450}
            height={450}
          />
        )}
      </div>

      <Range height='450' preset='columnBetween'>
        <Range preset='column' gap='10'>
          <div className={panelTitle}>{props?.title}</div>

          {props.reserve && (
            <LabelTitle
              label='배송일'
              content={`${dayjs(props?.reserve).format('YYYY년 MM월 DD일')}`}
            />
          )}
          <LabelTitle label='가격' content={`${comma(props?.price || 0)}원`} />
          <LabelTitle label='갯수' content={`${props?.list?.length || 0}개`} />
          <LabelTitle label='제조사' content={props?.company || ''} />
          <LabelTitle
            label='택배비'
            content='3,000원 [50,000원 이상 구매시 무료]'
          />
          <LabelTitle label='적립금' content={`${props?.price * 0.01 || 0}p`} />
        </Range>

        <Range preset='column' gap='10'>
          <Range width='full' preset='right'>
            <LabelTitle
              label='TOTAL'
              content={`${comma(
                tempCart.reduce((a, b) => {
                  return a + b.count * b.price;
                }, 0)
              )}원`}
              status='large'
            />
          </Range>

          <DropDown props={props} status={props.reserve !== ''} />

          <Range gap='10'>
            <Btn>BUY</Btn>

            <Btn
              color='reversePrimary'
              onClick={() => {
                const data = tempCart.map(({ name, code, count }) => ({
                  name,
                  code,
                  count,
                }));

                postCart({
                  email: JSON.parse(Cookies.get('userInfo') || '').email,
                  num: props.num,
                  updatedArray: data,
                });
              }}
            >
              CART
            </Btn>
            <HeartBtn size={45} num={props.num} status={like} />
            <ImgBtn
              width={38}
              height={45}
              onClick={() =>
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => alert('URL 복사됨!'))
                  .catch(() => alert('복사 실패'))
              }
            />
          </Range>
        </Range>
      </Range>
    </Range>
  );
}
