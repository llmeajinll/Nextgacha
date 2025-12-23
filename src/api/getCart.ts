'use server';
import { auth } from '@/auth';

export default async function getCart() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const session = await auth();
  console.log('getCart start', session?.user?.email);
  console.log(`${baseUrl}api/getCart?email=${session?.user?.email}`);
  const data = await fetch(
    `http://localhost:3000/api/protected/getCart?email=${session?.user?.email}`,
    // `${baseUrl}/api/getCart}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['cart'] },
    } as any
  )
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
