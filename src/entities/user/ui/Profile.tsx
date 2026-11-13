'use client';

import React from 'react';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { User } from 'pixelarticons/react';
import { comma } from '@/shared/lib/comma';
import { userInfoAtom } from '@/entities/user/model/store';
import * as s from './profile.css';

export default function Profile() {
  const { data } = useAtomValue(userInfoAtom);

  // 불러오는 동안에도 높이를 잡아 둬서 아래 탭이 밀리지 않게 한다
  return (
    <section aria-label='내 정보' className={s.wrapper}>
      {data?.image ? (
        <Image src={data.image} alt='' width={64} height={64} className={s.avatar} />
      ) : (
        <span aria-hidden className={s.avatar}>
          <User width={32} height={32} />
        </span>
      )}
      <span className={s.text}>
        <span className={s.name}>{data?.nickname}</span>
        <span className={s.email}>{data?.email}</span>
      </span>
      <span className={s.pointBox}>
        <span className={s.pointLabel}>보유 포인트</span>
        <span className={s.point}>{comma(data?.point ?? 0)}P</span>
      </span>
    </section>
  );
}
