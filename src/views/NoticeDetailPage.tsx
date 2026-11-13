import React from 'react';
import Image from 'next/image';
import { toBlocks, type Notice } from '@/entities/notice/model/types';
import { Range } from '@/shared/ui';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'pixelarticons/react';
import {
  container,
  backLink,
  backArrow,
  titleRow,
  num,
  title,
  createdAt,
  divider,
  content,
  contentList,
  contentImage,
  navRow,
  navLink,
  navLinkNext,
  navIconLeft,
  navIconRight,
} from './noticeDetailPage.css';

// 공지 상세. prev는 더 오래된 공지, next는 더 최근 공지
export default function NoticeDetailPage({ notice, prev, next }: { notice: Notice; prev?: number; next?: number }) {
  return (
    <Range preset='columnBetween' width='full' className={container}>
      <Link href='/notice' className={backLink}>
        <span className={backArrow}>{'<< '}</span>NOTICE
      </Link>

      <Range preset='between' width='full' className={titleRow}>
        <div>
          <span className={num}>{notice.pinned ? '공지' : `${notice.num}.`}</span>
          <span className={title}>{notice.title}</span>
        </div>
        <div className={createdAt}>{notice.publish_at}</div>
      </Range>
      <div className={divider}></div>
      <Range preset='column' width='full' className={content}>
        {toBlocks(notice.content).map((b, i) =>
          b.type === 'image' ? (
            <Image key={i} src={b.url} alt='' width={960} height={540} sizes='(max-width: 960px) 100vw, 960px' className={contentImage} />
          ) : (
            <div key={i}>{b.text}</div>
          ),
        )}
        {Array.isArray(notice.list) && (
          <div className={contentList}>
            {notice.list.map((val, idx) => (
              <div key={idx}>{val}</div>
            ))}
          </div>
        )}
      </Range>

      <div className={divider}></div>
      <Range preset='between' width='full' className={navRow}>
        {prev && (
          <Link href={`/notice/${prev}`} className={navLink}>
            <ChevronLeft width={16} height={16} className={navIconLeft} aria-hidden />
            PREV
          </Link>
        )}
        {next && (
          <Link href={`/notice/${next}`} className={navLinkNext}>
            NEXT
            <ChevronRight width={16} height={16} className={navIconRight} aria-hidden />
          </Link>
        )}
      </Range>
    </Range>
  );
}
