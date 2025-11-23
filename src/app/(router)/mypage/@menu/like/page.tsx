'use server';

import React from 'react';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { CartTemplate } from '@/components/organisms';

export default async function page() {
  const session = await auth();
  const cookieStore = cookies();
  let userCookie = null;

  // console.log('mypage session:', session);
  if (session?.user) {
    const cookie = (await cookieStore).get('userInfo');
    if (cookie?.value) {
      try {
        userCookie = JSON.parse(cookie.value);
        console.log('Parsed userCookie:', userCookie);
      } catch (err) {
        console.error('Failed to parse userInfo cookie:', err);
        userCookie = {};
      }
    } else {
      console.log('userInfo cookie not found');
      userCookie = {};
    }
  }
  return (
    <>
      <CartTemplate like={userCookie?.like} />
    </>
  );
}
