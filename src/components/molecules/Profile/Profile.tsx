'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { profileImage, email, point, address } from './profile.css';
import { comma } from '@/shared/comma';

export default function Profile() {
  const [user, setUser] = useState({
    email: '',
    nickname: '',
    point: 0,
    address: '',
    image: '',
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      await fetch(`/api/protected/getUser`)
        .then(async (res) => {
          const data = await res.json();
          // console.log('client user : ', data);

          if (data.ok === true) {
            setUser(data.result);
          }

          // return res;
        })
        .catch((err) => console.log(err));
    };

    fetchUserData();
  }, []);

  // console.log(user);

  return (
    <Range gap='15' style={{ marginBottom: '20px' }}>
      <Image
        src={user?.image || '/images/defaultImg.png'}
        alt='image'
        width={100}
        height={100}
        className={profileImage}
      />
      <Range preset='column' gap='4'>
        <div style={{ fontSize: '20px' }}>{user?.nickname}</div>
        <div className={email}>{user?.email}</div>
        <Range className={address}>
          <div>{user?.address}</div>
          <div style={{ marginLeft: '6px', cursor: 'pointer' }}>[수정]</div>
        </Range>

        <Range gap='5'>
          <Image src='/images/point.png' width={22} height={22} alt='point' />
          <div className={point}>{comma(user?.point || 0)}P</div>
        </Range>
      </Range>
    </Range>
  );
}
