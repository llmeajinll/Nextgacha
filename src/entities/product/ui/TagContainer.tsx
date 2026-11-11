import React from 'react';
import { Tag } from '@/shared/ui';
import { containter } from './tagContainer.css';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import { vars } from '@/styles/theme.css';

export default function TagContainer({
  create,
  reserve,
}: {
  create: string;
  reserve: string;
}) {
  // console.log(`create: ${create}, reserve: ${reserve}`);
  return (
    <div className={containter}>
      {create && (
        <>
          <Tag word='NEW' color={vars.status.new} />
          <Tag word='HOT' color={vars.status.hot} />
        </>
      )}
      {reserve && (
        <Tag
          word={`${toKoreaTime(reserve).format('YYYY년 MM월')} 예약`}
          color={vars.status.reserve}
        />
      )}
      {/*   
      <Tag word='2025년 12월 예약' color={vars.status.reserve} />
      <Tag word='HOT' color={vars.status.hot} />
      <Tag word='NEW' color={vars.status.new} />
      {/* <Tag word='SOLD OUT' color='#DCDCDC' /> */}
    </div>
  );
}
