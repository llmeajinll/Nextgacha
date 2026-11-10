'use client';

import React, { useState, useMemo, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAtom } from 'jotai';
import { tempCartAtom } from '@/features/cart/model/store';
import { useModal } from '@/shared/hooks';

import { Btn, ImgBtn, ReactSlick, Range } from '@/shared/ui';
import BuyBtn from '@/features/purchase/ui/BuyBtn';
import { HeartBtn } from '@/entities/product/ui';
import { DropDown } from '@/features/cart/ui';
import { LabelTitle } from '@/shared/ui';
import { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import {
  FREE_SHIPPING_MIN,
  SHIPPING_FEE,
} from '@/features/purchase/lib/orderPolicy';
import { useTempCart } from '@/features/cart/model';
import {
  panelTitle,
  copyText,
  panelRoot,
  fullWidth,
} from './productPurchasePanel.css';
import { postCart } from '@/features/cart/api/postCart';

export default function InfoPanel({ props }: { props: CardProps }) {
  // console.log('infopanel', props);
  const router = useRouter();
  const { openModal } = useModal();

  const [tempCart] = useAtom(tempCartAtom);
  const [showText, setShowText] = useState(false);
  const textDomRef = useRef<HTMLDivElement | null>(null);

  console.log('jotai tempCart : ', tempCart);

  const totalPrice = useMemo(() => {
    return tempCart?.product.reduce((a: any, b: any) => {
      return (
        a +
        b.count * ((tempCart?.price || 0) * (1 - tempCart.discount / 100) || 0)
      );
    }, 0);
  }, [tempCart]);

  // 서버(orderPolicy)와 같은 규칙: 50,000원 미만이면 배송비 추가
  const payPrice =
    totalPrice > 0
      ? totalPrice + (totalPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE)
      : 0;

  const discountPrice = props.price * (1 - props.discount / 100);

  const onClickCart = async () => {
    if (tempCart.product.length === 0) {
      openModal('담은 상품이 없습니다.');
      return;
    }
    console.log('POST cart', tempCart.product, tempCart.num);
    await postCart({
      num: tempCart.num,
      updatedArray: tempCart.product,
    }).then(async (res) => {
      if (res.ok === true) {
        openModal(
          '장바구니에 정상적으로 들어갔습니다.\n장바구니로 이동하시겠습니까?',
          {
            onClickCheck: () => router.push('/mypage/cart'),
            onClickCancel: () => window.location.reload(),
            onClickClose: () => window.location.reload(),
          },
        );
      } else {
        openModal(res.message ?? '로그인 후 장바구니에 담을 수 있습니다.');
      }
    });
  };

  console.log('discountPrice : ', discountPrice);

  return (
    <Suspense fallback={<div>InfoPanel loading...</div>}>
      <Range width='960' gap='30' className={panelRoot}>
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
            {props.reserveStart && props.reserveEnd && (
              <LabelTitle
                label='예약 기간'
                content={`${dayjs(props.reserveStart).format('YYYY.MM.DD')} ~ ${dayjs(props.reserveEnd).format('YYYY.MM.DD')}`}
              />
            )}
            <LabelTitle
              label='가격'
              content={`${
                props.isDiscount === true
                  ? comma(discountPrice || 0) +
                    '원 [' +
                    props.discount +
                    ' % 할인]'
                  : comma(discountPrice || 0) + '원'
              }`}
            />
            <LabelTitle
              label='종류'
              content={`${props?.list?.length || 0}가지`}
            />
            <LabelTitle label='제조사' content={props?.company || ''} />
            <LabelTitle
              label='택배비'
              content='3,000원 [50,000원 이상 구매시 무료]'
            />
            <LabelTitle
              label='적립금'
              content={`${Math.floor(discountPrice * 0.01) || 0}p`}
            />
          </Range>

          <Range preset='column' gap='10'>
            <Range width='full' preset='right'>
              <LabelTitle
                label='TOTAL'
                content={`${comma(payPrice)} WON`}
                status='large'
              />
            </Range>

            <DropDown props={props} status={props.reserve !== ''} />

            <Range width='full' preset='between' gap='10'>
              <BuyBtn
                props={{
                  price: payPrice,
                  size: 'medium',
                  list: [{ product: tempCart.product, num: tempCart.num }],
                  usedPoint: 0,
                }}
              />

              {/* addPoint
: 
180
list
: 
Array(2)
0
: 
{num: 12, product: Array(1)}
1
: 
{num: 28, product: Array(3)}
length
: 
2
[[Prototype]]
: 
Array(0)
price
: 
21000
usedPoint
: 
0 */}
              <Btn
                color='reversePrimary'
                // size='extra'
                onClick={onClickCart}
                className={fullWidth}
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
    </Suspense>
  );
}
// const data = { status: !liked, num: num };
// postLike(data);
// setLiked(!liked);
