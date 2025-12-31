'use server';

import { signIn, signOut } from '@/auth';
// import { cookies } from 'next/headers';

export async function kakaoSignIn() {
  // console.log('signin called');
  await signIn('kakao');
}
export async function kakaoSignOut() {
  // console.log('signout called');
  await signOut();
}
