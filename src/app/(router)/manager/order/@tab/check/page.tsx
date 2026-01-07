import React, { useState, useEffect } from 'react';
import { ObjectId } from 'mongodb';
import { baseUrl } from '@/shared/baseUrl';
import OrderTemplate from '@/components/templates/OrderTemplate/OrderTemplate';

export default async function CheckPage() {
  console.log('check');

  const data = await fetch(`${baseUrl}/api/getOrderSort?status=상품 확인중`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  }).then(async (res) => {
    const data = await res.json();
    // console.log(data);
    return data;
  });

  const { result, nextCursor } = data;

  return (
    <div>
      <OrderTemplate
        props={result}
        getLastId={nextCursor}
        status='상품 확인중'
      />
    </div>
  );
}
