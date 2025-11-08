import React from 'react';
import { Tag } from '@/components/atoms';
import { containter } from './tagContainer.css';
import dayjs from 'dayjs';

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
          <Tag word='NEW' color='#FFDFAB' />
          <Tag word='HOT' color='#FFA5A5' />
        </>
      )}
      {reserve && (
        <Tag
          word={`${dayjs(reserve).format('YYYY년 MM월')} 예약`}
          color='#BCE2FF'
        />
      )}
      {/*   
      <Tag word='2025년 12월 예약' color='#BCE2FF' />
      <Tag word='HOT' color='#FFA5A5' />
      <Tag word='NEW' color='#FFDFAB' />
      {/* <Tag word='SOLD OUT' color='#DCDCDC' /> */}
    </div>
  );
}
