'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Range, Btn } from '@/components/atoms';
import { Cart } from '@/components/molecules';
import postCartProduct from '@/api/postCartProduct';
import { totalPriceStyle } from './carttemplate.css';
import { comma } from '@/shared/comma';
import Cookies from 'js-cookie';
import getCart from '@/api/getCart';

export default function CartTemplate({ props }: { props?: any }) {
  // const [items, setItems] = useState([] as any[]);
  // const [totalPrice, setTotalPrice] = useState(0);
  // const result = await getCart();
  // console.log('result from getCart in CartTemplate: ', result);

  console.log('props : ', props);

  const totalPrice = useMemo(() => {
    return props.reduce((acc: any, item: any) => {
      const itemTotal =
        item.price *
        item.product.reduce(
          (prodAcc: number, prod: any) => prodAcc + prod.count,
          0
        );
      return acc + itemTotal;
    }, 0);
  }, [props]);

  // useEffect(() => {
  //   async function fetchData() {
  //     return getCart()
  //       .then((res) => {
  //         console.log('CartTemplate getCart res:', res);

  //         setItems(res || []);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         return [];
  //       });
  //   }

  //   fetchData();
  // router.refresh();
  // }, []);

  return (
    <>
      <Range
        preset='columnCenter'
        gap='10'
        style={{
          width: '100%',
          marginBottom: '50px',
          padding: '15px 0px',
        }}
      >
        {props?.map((item: any, index: number) => (
          <Cart key={index} props={item} />
        ))}
        {totalPrice < 50000 && (
          <div>
            <span style={{ fontFamily: 'silkscreen', fontSize: '20px' }}>
              Delivery Fee : 3,000WON{' '}
            </span>
            <span style={{ fontSize: '16px', color: 'gray' }}>
              [50,000원 이상 구매 시 무료배송]
            </span>
          </div>
        )}
        <Range gap='30'>
          <div className={totalPriceStyle}>
            <span style={{ color: 'lightblue' }}>TOTAL</span> :{' '}
            {comma(totalPrice < 50000 ? totalPrice + 3000 : totalPrice)}
            WON
          </div>
          <Range preset='center' gap='8' className={totalPriceStyle}>
            <span style={{ color: 'lightblue' }}>REWARD</span> :{' '}
            <Image
              src='/images/point.png'
              alt='point'
              width={24}
              height={24}
            ></Image>
            {totalPrice * 0.01}p
          </Range>
        </Range>
      </Range>
      <Btn size='big'>BUY</Btn>
    </>
  );
}
