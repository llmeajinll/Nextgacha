'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'jotai';
import { CardProps } from '@/shared/type';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';


export default function ProductPurchasePanel({ num }: { num: string }) {
  console.log(num);

  const [info, setInfo] = useState<CardProps>({} as CardProps);

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
  }, []);

  return (
    <>
      <Provider>
        <InfoPanel props={info} />
        <TicketPanel />
      </Provider>
    </>
  );
}
