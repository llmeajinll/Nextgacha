'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Parking } from 'pixelarticons/react';
import { Range } from '@/shared/ui';
import { profileImage, email, point, name, wrapper, pointRow, pointIcon } from './profile.css';
import { comma } from '@/shared/lib/comma';
import { userInfoAtom } from '@/entities/user/model/store';
import { useAtom } from 'jotai';
import { useModal } from '@/shared/hooks';

export default function Profile() {
  const router = useRouter();
  const { openModal } = useModal();
  const [{ data, isPending, error }] = useAtom(userInfoAtom);

  if (isPending) return <div>LOADING...</div>;
  if (error) return <div>에러다잇!</div>;

  return (
    <Range gap='15' className={wrapper}>
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
        <Range gap='4' className={pointRow}>
          <Parking width={22} height={22} className={pointIcon} aria-label='포인트' />
          <div className={point}>{comma(data?.point || 0)}P</div>
        </Range>
      </Range>
    </Range>
  );
}
