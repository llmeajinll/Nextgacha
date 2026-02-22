'use client';

import { useState, useEffect, Suspense } from 'react';
import { Provider } from 'jotai';
import { CardProps } from '@/shared/type';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';
import { useTempCart } from '@/app/hooks';

export default function ProductPurchasePanel({ num }: { num: string }) {
  console.log('url num', num);

  const [info, setInfo] = useState<CardProps>({} as CardProps);
  const { tempCart } = useTempCart(num);

  useEffect(() => {
    const fetchInfo = async () => {
      await fetch(`/api/getOneProduct?num=${num}`)
        .then(async (res) => {
          const data = await res.json();
          console.log('res : ', data.result);
          setInfo(data.result);
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
      <Suspense fallback={<div>PROFILE LOADING ...</div>}>
        <InfoPanel props={info} />
        {/* <TicketPanel tempCart={tempCart} increase={() => increase} /> */}
        <TicketPanel />
      </Suspense>

      {/* </Provider> */}
    </>
  );
}
