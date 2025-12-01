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

export default function Notice() {
  return (
    <Range preset='between' gap='10' className={noticeContainer}>
      <div className={noticeNum}>1</div>
      <div className={noticeTitle}>
        <Link href={`/notice/1`}>testestestestestestest</Link>
      </div>
      <div className={noticeCreateDate}>{dayjs().format('YYYY-MM-DD')}</div>
    </Range>
  );
}
