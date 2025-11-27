'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Range, Btn } from '@/components/atoms';
import { Cart } from '@/components/molecules';
import postCartProduct from '@/api/postCartProduct';
import { totalPriceStyle } from './carttemplate.css';
import { comma } from '@/shared/comma';
import Cookies from 'js-cookie';

export default function CartTemplate() {
  const [items, setItems] = useState([] as any[]);
  const [totalPrice, setTotalPrice] = useState(0);

  /** ------------------------
   *   쿠키 파싱
   * ------------------------ */

  const getCookie = (value: string | undefined) => {
    try {
      if (!value || value === 'undefined' || value === '') return null;
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const parsed = getCookie(Cookies.get('userInfo'));
  const cart = parsed?.cart ?? [];

  console.log('userInfo cart:', cart);

  /** ------------------------
   *   서버에서 상품 정보 가져오기
   * ------------------------ */

  useEffect(() => {
    async function fetchData() {
      const data = cart?.map((item: any) => item.num);

      const result = await postCartProduct({ data })
        .then((res: any) => {
          if (cart) {
            return cart?.map((c: any) => {
              const prod = res.find((p: any) => p.num === c.num);
              setTotalPrice(
                (prev) =>
                  (prev += c.product.reduce(
                    (acc: number, cur: any) => acc + cur.count * prod.price,
                    totalPrice
                  ))
              );

              return {
                productInfo: prod,
                cartProducts: c.product,
              };
            });
          }
        })
        .catch((err) => {
          return [];
        });

      console.log('CartTemplate result:', result);

      setItems(result ?? []);
    }
    fetchData();
  }, []);
  // console.log('merged cart items:', merged);

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
        {items?.map((item: any, index: number) => (
          <Cart key={index} props={item} />
        ))}
        <div className={totalPriceStyle}>TOTAL : {comma(totalPrice)}WON</div>
      </Range>
      <Btn size='big'>BUY</Btn>
    </>
  );
}
