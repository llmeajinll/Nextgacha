import OrderTemplate from '@/components/templates/OrderTemplate/OrderTemplate';
import { baseUrl } from '@/shared/baseUrl';
import React from 'react';

export default async function RefundPage() {
  console.log('sending');
  let lastId = '';

  const data = await fetch(`${baseUrl}/api/getOrderSort?status=환불`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  }).then(async (res) => {
    const data = await res.json();
    console.log(data);
    return data;
  });

  // if (list.length > 0) lastId = list[list.length - 1]._id;

  const { result, nextCursor } = data;

  return (
    <div>
      <OrderTemplate props={result} getLastId={nextCursor} status='환불' />
    </div>
  );
}
