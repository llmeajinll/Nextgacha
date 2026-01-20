'use client';

import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Cookie from 'js-cookie';
import { setTempCartAtom, tempCartAtom } from '@/jotai/store';
import { Ticket, TicketContainer } from '@/components/molecules';
import { useTempCart } from '@/app/hooks';
import useSplitRoute from '@/app/hooks/useSplitRoute';

export default function TicketPanel({}: // tempCart,
// increase,
{
  // tempCart: any;
  // increase: (name: string) => void;
}) {
  const { firstRoute } = useSplitRoute();
  console.log('firstRoute : ', firstRoute);
  // const [tempCart] = useAtom(tempCartAtom);
  // const tempCarQuery = useTempCart(firstRoute);
  const isValid = firstRoute && !isNaN(Number(firstRoute));

  const { increase, decrease, erase } = useTempCart(firstRoute);
  const [tempCart, setTempCart] = useAtom(tempCartAtom);
  const { title, price, num, discount } = tempCart;
  console.log(`title, price, num, discount`, title, price, num, discount);

  if (!isValid) return null;
  useEffect(() => {
    return () =>
      setTempCart({
        title: '',
        price: 0,
        num: null,
        discount,
        product: [],
      });
  }, []);
  // const data = tempCartQuery?.data;
  // const increase = tempCartQuery?.increase;

  console.log('TicketPanel props:', tempCart?.product);
  // console.log('tempCart : ', tempCart);

  return (
    <>
      {Array.isArray(tempCart?.product) && tempCart.product.length > 0 && (
        <TicketContainer status='detail'>
          {tempCart?.product?.map((val: any, key: number) => {
            console.log('tempCart val : ', val.name);
            return (
              <Ticket
                props={{
                  title,
                  price,
                  num,
                  name: val.name,
                  count: val.count,
                  discount: discount,
                }}
                key={key}
                increase={increase}
                decrease={decrease}
                erase={erase}
              />
            );
          })}
        </TicketContainer>
      )}
    </>
  );
}
