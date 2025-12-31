'use server';

import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';

export default async function updateCart({
  preset,
  code,
}: {
  preset: 'increase' | 'decrease' | 'erase';
  code: string;
}) {
  // console.log('updateCart data input:', preset, code);
  const session = await auth();
  const data = { preset, code, email: session?.user?.email };
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const res = await fetch(`http://localhost:3000/api/updateCart`, {
    //   const res = await fetch(`/api/updateCart`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  // console.log(data.preset, ' result:', result);

  if (result.acknowledged === true && result.modifiedCount > 0) {
    revalidateTag('cart', 'default');
    // console.log('Cart revalidated!');
  }

  return result;
}
