'use server';
import { auth } from '@/auth';

export default async function getCart() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  console.log(baseUrl);
  const session = await auth();
  console.log('getCart session:', session);
  const url = new URL('/api/getCart', baseUrl);
  const data = await fetch(
    `${baseUrl}/api/getCart?email=${session?.user?.email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['cart'] },
    } as any
  )
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
      console.log('getCart Api', result);
      if (result && result.ok === true) {
        return result.data;
      }
      return [];
    })
    .catch((err) => {
      console.log('fetch getCart error:', err);
      return [];
    });

  // console.log('header user:', data);

  return data;
}
