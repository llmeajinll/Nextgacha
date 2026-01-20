'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { profileImage, email, point, name } from './profile.css';
import { comma } from '@/shared/comma';
import { userInfoAtom } from '@/jotai/store';
import { useAtom } from 'jotai';
import { useModal } from '@/app/hooks';

export default function Profile() {
  const router = useRouter();
  // const [user, setUser] = useState({
  //   email: '',
  //   nickname: '',
  //   point: 0,
  //   address: '',
  //   image: '',
  // });
  const { openModal } = useModal();
  // const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [{ data, isPending, error }] = useAtom(userInfoAtom);
  // const [, setUserInfo] = useAtom(setUserInfoAtom);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     await fetch(`/api/getUser`, { cache: 'no-store' })
  //       .then(async (res) => {
  //         const data = await res.json();
  //         console.log('client user : ', data);

  //         if (data.ok === true) {
  //           const result = data.result;
  //           setUserInfo(result);
  //         }

  //         // return res;
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   fetchUserData();
  //   console.log('userInfo : ', userInfo);
  // }, []);

  // console.log(user);

  if (isPending) return <div>LOADING...</div>;
  if (error) return <div>에러다잇!</div>;

  return (
    <Range gap='15' style={{ marginBottom: '20px' }}>
      <Image
        src={data?.image || '/images/defaultImg.png'}
        alt='image'
        width={100}
        height={100}
        className={profileImage}
      />
      <Range preset='column' gap='5'>
        <div className={name}>{data?.nickname}</div>
        <div className={email}>{data?.email}</div>
        <Range gap='4' style={{ marginTop: '10px' }}>
          <Image src='/images/point.png' width={22} height={22} alt='point' />
          <div className={point}>{comma(data?.point || 0)}P</div>
        </Range>
      </Range>
    </Range>
  );
}
