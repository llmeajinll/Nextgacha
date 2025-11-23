'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Range, Btn } from '@/components/atoms';
import { Cart } from '@/components/molecules';
import { CardTemplate } from '@/components/organisms';
import postCartProduct from '@/api/postCartProduct';
import { totalPriceStyle } from './carttemplate.css';
import { comma } from '@/shared/comma';

export default function CartTemplate({
  cart,
  like,
}: {
  cart?: { num: number; product: any[] }[];
  like?: number[];
}) {
  // console.log('CartTemplate cart:', cart);

  const [items, setItems] = useState([] as any[]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const data = cart ? cart?.map((item) => item.num) ?? [] : like ?? [];

      const result = await postCartProduct({ data })
        .then((res: any) => {
          if (cart) {
            return cart?.map((c) => {
              const prod = res.find((p: any) => p.num === c.num);
              setTotalPrice(
                (prev) =>
                  (prev += c.product.reduce(
                    (acc, cur) => acc + cur.count * prod.price,
                    totalPrice
                  ))
              );

              return {
                productInfo: prod,
                cartProducts: c.product,
              };
            });
          } else if (like) {
            return res;
          }
        })
        .catch((err) => {
          return [];
        });

      console.log('CartTemplate result:', result);
      setItems(result);
    }
    fetchData();
  }, []);

  // console.log('merged cart items:', merged);

  return (
    <>
      {cart ? (
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
            <div className={totalPriceStyle}>
              TOTAL : {comma(totalPrice)}WON
            </div>
          </Range>
          <Btn size='big'>BUY</Btn>
        </>
      ) : (
        <CardTemplate props={items} />
      )}
    </>
  );
}
