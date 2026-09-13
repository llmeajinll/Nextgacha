'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { CartTemplate } from '@/components/templates';
import getCart from '@/api/getCart';
import { baseUrl } from '@/shared/api/baseUrl';
import { Cart } from '@/components/molecules';
import { AddressTruck } from '@/entities/order/ui';
import { EmptyCard } from '@/shared/ui';

export default function page() {
  // const data = await getCart();

  // const [data, setData] = useState();
  // useEffect(() => {
  //   const fetchCartData = async () => {
  //     await getCart().then(async (res) => {
  //       console.log('cart data : ', res);
  //     });
  //   };
  //   fetchCartData();
  // }, []);
  // console.log('result from getCart in page: ', data);
  return (
    <>
      <Suspense fallback={<EmptyCard>CART LOADING...</EmptyCard>}>
        <CartTemplate />
      </Suspense>
    </>
  );
}
