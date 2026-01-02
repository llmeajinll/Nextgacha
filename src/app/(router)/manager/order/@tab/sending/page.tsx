import React, { useState, useEffect } from 'react';
import { ObjectId } from 'mongodb';
import { baseUrl } from '@/shared/baseUrl';
import OrderTemplate from '@/components/templates/OrderTemplate/OrderTemplate';

export default async function SendingPage() {
  console.log('sending');
  let lastId = '';

  const data = await fetch(`${baseUrl}/api/getOrderSort?status=배송중`, {
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
      <OrderTemplate props={result} getLastId={nextCursor} status='배송중' />
    </div>
  );
}
