'use client';

import React from 'react';
import { signIn, signOut } from '@/auth';
import kakao_login from '../../../../public/assets/images/kakao_login.png';

export default async function AuthBtn() {
  return (
    <div>
      <form
        action={async () => {
          await signIn('kakao');
        }}
      >
        <button
          type='submit'
          style={{ backgroundImage: 'url(kakao_login)', width: '400px' }}
        >
          Signin with Kakao
        </button>
      </form>
      <form
        action={async () => {
          await signIn('kakao');
        }}
      ></form>
      <button type='submit'>Signout with Kakao</button>
    </div>
  );
}
