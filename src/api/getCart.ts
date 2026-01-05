// 'use server';
import { auth } from '@/auth';
import { baseUrl } from '@/shared/baseUrl';

export default async function getCart() {
  // console.log('getCart preview', session?.user?.email);

  const session = await auth();
  const data = await fetch(
    `${baseUrl}/api/getCart?email=${session?.user?.email}`,
    // `${baseUrl}/api/getCart}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',

      next: { tags: ['cart'] },
    } as any
  )
    .then(async (res) => {
      const result = await res.json();
      // console.log('getCart Api', result);
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
