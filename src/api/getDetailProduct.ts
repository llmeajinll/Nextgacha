'use server';
import { auth } from '@/auth';
import { headers } from 'next/headers';

export default async function getDetailProduct(num: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  console.log('getDetailProduct num: ', num);

  const data = await fetch(`${baseUrl}/api/getProduct?num=${num}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { tags: ['productInfo'] },
  } as any)
    //   const data = await fetch(url, {
    //     method: 'GET',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     next: { tags: ['cart'] },
    //   })
    .then(async (res) => {
      const result = await res.json();
      console.log('getDetailProduct Api', result);
      if (result) {
        return result[0];
      }
      return [];
    })
    .catch((err) => {
      console.log('fetch getDetailProduct error:', err);
      return [];
    });

  // console.log('header user:', data);

  return data;
}
