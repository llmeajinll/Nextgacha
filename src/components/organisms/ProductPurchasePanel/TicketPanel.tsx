'use client';

import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Cookie from 'js-cookie';
import { tempCartAtom } from '@/jotai/store';
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

  const { data, tempCart, increase, decrease, erase } = useTempCart(firstRoute);
  const { title, price, num } = tempCart;

  if (!isValid) return null;
  useEffect(() => {
    console.log('useEffect TicketPanel props:', tempCart?.list);
  }, [isValid, tempCart]);
  // const data = tempCartQuery?.data;
  // const increase = tempCartQuery?.increase;

  console.log('TicketPanel props:', tempCart?.list);
  // console.log('tempCart : ', tempCart);

  return (
    <>
      {Array.isArray(tempCart?.list) && tempCart.list.length > 0 && (
        <TicketContainer status='detail'>
          {tempCart?.list?.map((val: any, key: number) => {
            console.log('tempCart val : ', val.name);
            return (
              <Ticket
                props={{ title, price, num, name: val.name, count: val.count }}
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
