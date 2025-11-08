'use client';

import { Btn, HeartBtn, ImgBtn, ReactSlick, Range } from '@/components/atoms';
import { DropDown, LabelTitle, Ticket } from '@/components/molecules';
import { panelTitle, ticketContainer } from './productPurchasePanel.css';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { tempCartAtom, addToTempCartAtom } from '@/jotai/store';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import { CardProps } from '@/shared/type';
import { comma } from '@/shared/comma';

export default function ProductPurchasePanel() {
  const [tempCart] = useAtom(tempCartAtom);
  const [, addToTempCart] = useAtom(addToTempCartAtom);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { route, seperatedRoute } = useSplitRoute();
  const [info, setInfo] = useState<CardProps>({} as CardProps);
  const [like, setLike] = useState(false);

  console.log('seperatedRoute:', seperatedRoute);

  useEffect(() => {
    // ensure seperatedRoute is available before calling the API
    if (!seperatedRoute || !seperatedRoute[1]) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/getProduct?num=${seperatedRoute[1]}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('product', data);
        setInfo(data[0]);
      });

    const raw = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userInfo='))
      ?.split('=')[1];

    const userInfo = raw ? JSON.parse(decodeURIComponent(raw)) : null;

    if (userInfo && userInfo.like) {
      console.log(
        'userInfo.like:',
        userInfo.like,
        'props.num:',
        info.num,
        userInfo.like.includes(Number(seperatedRoute[1]))
      );
      setLike(userInfo.like.includes(Number(seperatedRoute[1])));
    }

    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <Range
        width='960'
        gap='30'
        style={{
          marginBottom: '60px',
        }}
      >
        <div>
          {info?.image?.length ? (
            <ReactSlick image={info?.image} preset='small' />
          ) : (
            <Image
              src='/images/defaultImg.png'
              alt='image'
              width={450}
              height={450}
            />
          )}
        </div>
        {/* <Range height='450' direction='column' justify='spacebetween'> */}
        <Range height='450' preset='columnBetween'>
          {/* <Range direction='column' gap='10'> */}
          <Range preset='column' gap='10'>
            <div className={panelTitle}>{info?.title}</div>

            <LabelTitle label='가격' content={`${comma(info?.price || 0)}원`} />
            <LabelTitle label='갯수' content={`${info?.list?.length || 0}개`} />
            <LabelTitle label='제조사' content={info?.company || ''} />
            <LabelTitle
              label='택배비'
              content='3,000원 [50,000원 이상 구매시 무료]'
            />
            <LabelTitle
              label='적립금'
              content={`${info?.price * 0.01 || 0}p`}
            />
          </Range>

          <Range preset='column' gap='10'>
            <Range width='full' preset='right'>
              <LabelTitle
                label='총합'
                content={`${comma(
                  tempCart.reduce((a, b) => {
                    return a + b.count * b.price;
                  }, 0)
                )}원`}
                status='large'
              />
            </Range>

            <DropDown props={info} status={info.reserve !== ''} />

            <Range gap='10'>
              <Btn>BUY</Btn>
              <Btn color='reversePrimary'>CART</Btn>
              <HeartBtn size={45} status={like} />
              <ImgBtn width={38} height={45} />
            </Range>
          </Range>
        </Range>
      </Range>
      {tempCart && (
        <div className={ticketContainer} ref={scrollRef}>
          {tempCart.map((val, key) => {
            return <Ticket props={val} key={key} />;
          })}
        </div>
      )}
    </>
  );
}
