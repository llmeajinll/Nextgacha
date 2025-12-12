'use server';

import React from 'react';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { profileImage, email, point } from './profile.css';
import { comma } from '@/shared/comma';

export default async function Profile() {
  const session = await auth();
  const cookieStore = cookies();
  let userCookie = null;

  //   console.log('mypage session:', session);
  if (session?.user) {
    const cookie = (await cookieStore).get('userInfo');
    userCookie = cookie ? JSON.parse(cookie.value) : null;
    console.log('Cookie : ', userCookie);
  } else {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Range gap='15' style={{ marginBottom: '20px' }}>
      <Image
        src={session?.user?.image || '/images/defaultImg.png'}
        alt='image'
        width={100}
        height={100}
        className={profileImage}
      />
      <Range preset='column' gap='4'>
        <div style={{ fontSize: '20px' }}>{session?.user?.name}</div>
        <div className={email}>{session?.user?.email}</div>

        <Range gap='5'>
          <Image src='/images/point.png' width={22} height={22} alt='point' />
          <div className={point}>{comma(userCookie?.point)}P</div>
        </Range>
      </Range>
    </Range>
  );
}
