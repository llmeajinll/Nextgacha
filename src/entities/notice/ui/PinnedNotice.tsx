import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'pixelarticons/react';
import { dotDate, type Notice } from '../model/types';
import { pinned, pinIcon, pinBody, pinLabel, pinTitle, pinDate, pinArrow } from './notice.css';

// 목록 맨 위에 고정한 공지 카드
export default function PinnedNotice({ notice }: { notice: Notice }) {
  return (
    <Link href={`/notice/${notice.num}`} className={pinned}>
      <span className={pinIcon}>
        <MapPin width={24} height={24} aria-hidden />
      </span>
      <span className={pinBody}>
        <span className={pinLabel}>PINNED</span>
        <span className={pinTitle}>{notice.title}</span>
        <span className={pinDate}>{dotDate(notice.publish_at)}</span>
      </span>
      <ArrowRight width={24} height={24} className={pinArrow} aria-hidden />
    </Link>
  );
}
