'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Range, Btn } from '@/components/atoms';
import { Cart } from '@/components/molecules';
// import postCartProduct from '@/api/postCartProduct';
import { totalPriceStyle } from './carttemplate.css';
import { comma } from '@/shared/comma';
import { BuyBtn } from '@/components/atoms';
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

  console.log('totalPrice', totalPrice);

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
        {props.length === 0 ? (
          <div
            style={{
              boxSizing: 'border-box',
              width: '100%',
              height: '130px',
              padding: '20px',
              border: '1px solid lightgray',
              fontFamily: 'silkscreen',
              color: 'gray',
              fontSize: '30px',
              textAlign: 'center',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              lineHeight: '24px',
            }}
          >
            CART IS EMPTY
          </div>
        ) : (
          props?.map((item: any, index: number) => (
            <Cart key={index} props={item} />
          ))
        )}
        {totalPrice < 50000 && totalPrice > 1 && (
          <>
            <div style={{ fontFamily: 'silkscreen', fontSize: '24px' }}>
              PRICE :{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: '270px',
                  textAlign: 'right',
                }}
              >
                {comma(totalPrice)} WON
              </span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'silkscreen',
                  fontSize: '18px',
                }}
              >
                <span style={{ marginRight: '20px' }}>Delivery Fee :</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '202px',
                    textAlign: 'right',
                  }}
                >
                  + 3,000WON
                </span>
                <span
                  style={{
                    marginLeft: '10px',
                    fontSize: '16px',
                    color: 'gray',
                  }}
                >
                  [50,000원 이상 구매 시 무료배송]
                </span>
              </span>
            </div>
            <div
              style={{
                width: '700px',
                height: '1px',
                backgroundColor: 'lightgray',
              }}
            ></div>
          </>
        )}

        <Range gap='30'>
          <div className={totalPriceStyle}>
            <span style={{ color: 'lightblue' }}>TOTAL</span> :{' '}
            {comma(
              totalPrice < 50000 && totalPrice > 1
                ? totalPrice + 3000
                : totalPrice
            )}
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
      {/* <Btn size='big'>BUY</Btn> */}

      <BuyBtn
        props={{
          size: 'big',
          price: totalPrice < 50000 ? totalPrice + 3000 : totalPrice,
          list: props.reduce((acc: any, item: any) => {
            if (item && item.product) {
              acc.push({
                num: item.num,
                product: item.product.map((p: any) => ({
                  name: p.name,
                  count: p.count,
                })),
              });
            }
            return acc;
          }, [] as { num: number; product: { name: string; count: number }[] }[]),
        }}
      />
    </>
  );
}
