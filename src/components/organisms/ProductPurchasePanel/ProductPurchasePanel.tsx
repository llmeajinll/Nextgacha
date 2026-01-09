'use client';

import { useState, useEffect, Suspense } from 'react';
import { Provider } from 'jotai';
import { CardProps } from '@/shared/type';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';
import { useTempCart } from '@/app/hooks';

export default function ProductPurchasePanel({ num }: { num: string }) {
  console.log(num);

  const [info, setInfo] = useState<CardProps>({} as CardProps);
  const { data, increase, tempCart } = useTempCart(num);

  useEffect(() => {
    const fetchInfo = async () => {
      await fetch(`/api/getProduct?num=${num}`)
        .then(async (res) => {
          const data = await res.json();
          console.log('res : ', data);
          setInfo(data[0]);
          // return data;
        })
        .catch((err) => {
          console.log('err : ', err);
          return [];
        });
    };
    fetchInfo();
    console.log('tempCart : ', tempCart);
  }, [tempCart]);

  return (
    <>
      {/* <Provider> */}
      <Suspense fallback={<div>loading...</div>}>
        <InfoPanel props={info} />
        {/* <TicketPanel tempCart={tempCart} increase={() => increase} /> */}
        <TicketPanel />
      </Suspense>

      {/* </Provider> */}
    </>
  );
}
