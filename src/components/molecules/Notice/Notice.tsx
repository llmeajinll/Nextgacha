import React from 'react';
import { Range } from '@/components/atoms';
import dayjs from 'dayjs';
import Link from 'next/link';
import {
  noticeContainer,
  noticeNum,
  noticeCreateDate,
  noticeTitle,
} from './notice.css';

export default function Notice({ props }: { props: any }) {
  console.log('notice props', props);
  return (
    <Range preset='between' gap='10' className={noticeContainer}>
      <div className={noticeNum}>{props?.num}</div>
      <div className={noticeTitle}>
        <Link href={`/notice/${props?.num}`}>{props?.title}</Link>
      </div>
      <div className={noticeCreateDate}>
        {dayjs(props?.created_at).format('YYYY-MM-DD')}
      </div>
    </Range>
  );
}
