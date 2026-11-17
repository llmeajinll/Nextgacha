'use client';

import { useState, useEffect, Suspense } from 'react';
import { Provider } from 'jotai';
import { CardProps } from '@/entities/product/model/types';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';
import { useTempCart } from '@/features/cart/model';
import getOneProduct from '@/entities/product/api/getOneProduct';

export default function ProductPurchasePanel({ num }: { num: string }) {

  const [info, setInfo] = useState<CardProps>({} as CardProps);
  const { tempCart } = useTempCart(num);

  useEffect(() => {
    const fetchInfo = async () => {
      const product = await getOneProduct(Number(num));
      if (product) setInfo(product);
    };
    fetchInfo();
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
