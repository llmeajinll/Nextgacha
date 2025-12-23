'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/auth';

export default async function getLike() {
  // console.log(like);
  console.log('============ getLike');
  const session = await auth();
  const email = session?.user?.email;

  // console.log('auth email : ', email);

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  // const result = await fetch(`${baseUrl}/api/getLike`, {
  const result = await fetch(
    `http://localhost:3000/api/protected/getLike?email=${email}`,
    {
      method: 'GET',
      // body: JSON.stringify(like),
    }
  )
    .then(async (res) => {
      // console.log(res);
      if (res.ok === true) {
        const data = await res.json();
        return data.result;
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log('fetch postLike error:', err);
      return null;
    });

  // console.log('postLike data:', result);
  return result;
}
