'use server';

import { cookies } from 'next/headers';
import { signIn, signOut } from '@/auth';

export async function useAuth() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('authjs.session-token');

  console.log('useCookie:', token);

  async function kakaoSignIn() {
    await signIn('kakao');
  }
  async function kakaoSignOut() {
    await signOut();
  }

  return { kakaoSignIn, kakaoSignOut };
}
