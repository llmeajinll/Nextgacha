'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { CartTemplate } from '@/components/templates';
import getCart from '@/api/getCart';
import { baseUrl } from '@/shared/baseUrl';
import { Cart, EmptyCard, AddressTruck } from '@/components/molecules';

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
