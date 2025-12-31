'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAtom } from 'jotai';
import { tempCartAtom } from '@/jotai/store';

import {
  Btn,
  BuyBtn,
  HeartBtn,
  ImgBtn,
  ReactSlick,
  Range,
} from '@/components/atoms';
import { DropDown, LabelTitle } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import { comma } from '@/shared/comma';

import { panelTitle, copyText } from './productPurchasePanel.css';
import { postCart } from '@/api/postCart';
import postLike from '@/api/updateLike';

export default function InfoPanel({ props }: { props: CardProps }) {
  console.log('infopanel', props);
  const [tempCart] = useAtom(tempCartAtom);
  const [showText, setShowText] = useState(false);
  const textDomRef = useRef<HTMLDivElement | null>(null);
  const totalPrice = useMemo(() => {
    return tempCart.reduce((a, b) => {
      return a + b.count * b.price;
    }, 0);
  }, [tempCart]);

  return (
    <Range
      width='960'
      gap='30'
      style={{
        position: 'relative',
        marginBottom: '60px',
      }}
    >
      {showText && (
        <div className={copyText} ref={textDomRef}>
          COPY!
        </div>
      )}
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
              content={`${comma(totalPrice || 0)} WON`}
              status='large'
            />
          </Range>

          <DropDown props={props} status={props.reserve !== ''} />

          <Range gap='10' width='full' preset='right'>
            {/* <Btn>BUY</Btn> */}
            {/* <BuyBtn
              props={{
                // email,
                price: totalPrice,
                size: 'medium',
              }}
            /> */}

            <Btn
              color='primary'
              // size='extra'
              onClick={async () => {
                const data = tempCart.map(({ name, code, count }) => ({
                  name,
                  code,
                  count,
                }));

                await postCart({
                  // email: email,
                  num: props.num,
                  updatedArray: data,
                }).then(async (res) => {
                  if (res.ok === true) {
                    if (
                      window.confirm(
                        `장바구니에 정상적으로 들어갔습니다.\n장바구니로 이동하시겠습니까?`
                      )
                    ) {
                      window.location.href = '/mypage/cart';
                    } else {
                      window.location.reload();
                    }
                  } else {
                    alert('로그인 후 장바구니에 담을 수 있습니다.');
                  }
                });
              }}
            >
              CART
            </Btn>
            <HeartBtn
              size={45}
              num={props.num}
              // isLogin={false}
              status={props.like}
            />
            <ImgBtn
              width={38}
              height={45}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                const el = textDomRef.current;

                if (el) {
                  el.classList.remove(copyText);
                  void el.offsetWidth;
                  el.classList.add(copyText);
                }
                setShowText(true);
                window.setTimeout(() => {
                  setShowText(false);
                }, 1500);
              }}
            />
          </Range>
        </Range>
      </Range>
    </Range>
  );
}
// const data = { status: !liked, num: num };
// postLike(data);
// setLiked(!liked);
