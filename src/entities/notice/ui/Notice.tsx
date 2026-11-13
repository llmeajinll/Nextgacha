import React from 'react';
import Link from 'next/link';
import { Range } from '@/shared/ui';
import type { Notice as NoticeType } from '../model/types';
import { noticeContainer, noticeNum, noticeCreateDate, noticeTitle } from './notice.css';

// 공지 목록 한 줄. 고정 공지는 번호 자리에 '공지'
export default function Notice({ props }: { props: NoticeType }) {
  return (
    <Range preset='between' gap='10' className={noticeContainer}>
      <div className={noticeNum}>{props.pinned ? '공지' : props.num}</div>
      <div className={noticeTitle}>
        <Link href={`/notice/${props.num}`}>{props.title}</Link>
      </div>
      <div className={noticeCreateDate}>{props.publish_at.slice(0, 10)}</div>
    </Range>
  );
}
