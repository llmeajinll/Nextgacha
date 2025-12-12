'use server';

import React from 'react';
import { CartTemplate } from '@/components/templates';
import getCart from '@/api/getCart';

export default async function page() {
  const data = await getCart();
  console.log('result from getCart in page: ', data);
  return (
    <>
      <CartTemplate props={data} />
    </>
  );
}
