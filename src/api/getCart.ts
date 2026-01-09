// 'use server';
import { auth } from '@/auth';
import { baseUrl } from '@/shared/baseUrl';

export default async function getCart() {
  // console.log('getCart preview', session?.user?.email);

  const session = await auth();
  console.log(session?.user?.email);
  const data = await fetch(
    `/api/getCart?email=${session?.user?.email}`,
    // `${baseUrl}/api/getCart}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    } as any
  )
    .then(async (res) => {
      const data = await res.json();
      console.log('getCart Api', data.result);
      return data.result;
    })
    .catch((err) => {
      console.log('fetch getCart error:', err);
      return [];
    });

  // console.log('header user:', data);

  return data;
}
