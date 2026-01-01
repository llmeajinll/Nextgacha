// 'use client';

// import React, { useState, useEffect } from 'react';
import { CartTemplate } from '@/components/templates';
import getCart from '@/api/getCart';
import { baseUrl } from '@/shared/baseUrl';

export default async function page() {
  const data = await getCart();
  // const [data, setData] = useState();
  // useEffect(() => {
  //   const fetchCartData = async () => {
  //     await getCart().then(async (res) => {
  //       console.log('cart data : ', res);
  //     });
  //   };
  //   fetchCartData();
  // }, []);
  console.log('result from getCart in page: ', data, baseUrl);
  return (
    <>
      <CartTemplate props={data} />
    </>
  );
}
