import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, MapPin } from 'pixelarticons/react';
import { boldParts, dotDate, toBlocks, type Notice, type NoticeLink } from '@/entities/notice/model/types';
import NoticeTag from '@/entities/notice/ui/NoticeTag';
import ShareBtn from '@/entities/notice/ui/ShareBtn';
import {
  article,
  backLink,
  head,
  tagRow,
  pinLabel,
  title,
  meta,
  date,
  body,
  text,
  heading,
  quote,
  image,
  adjNav,
  adjRow,
  adjDir,
  adjTag,
  adjTitle,
  adjDate,
  listBtn,
} from './noticeDetailPage.css';

const Bold = ({ text: t }: { text: string }) =>
  boldParts(t).map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <React.Fragment key={i}>{p.text}</React.Fragment>));

// 이전·다음 공지 한 줄. next는 더 최근 공지, prev는 더 오래된 공지
const Adjacent = ({ dir, notice }: { dir: 'NEXT' | 'PREV'; notice?: NoticeLink }) =>
  notice && (
    <Link href={`/notice/${notice.num}`} className={adjRow}>
      <span className={adjDir}>{dir}</span>
      <span className={adjTag}>
        <NoticeTag category={notice.category} />
      </span>
      <span className={adjTitle}>{notice.title}</span>
      <span className={adjDate}>{dotDate(notice.publish_at)}</span>
    </Link>
  );

export default function NoticeDetailPage({ notice, prev, next }: { notice: Notice; prev?: NoticeLink; next?: NoticeLink }) {
  return (
    <article className={article}>
      <Link href='/notice' className={backLink}>
        <ChevronLeft width={16} height={16} aria-hidden />
        공지 목록
      </Link>

      <header className={head}>
        <span className={tagRow}>
          <NoticeTag category={notice.category} />
          {notice.pinned && (
            <span className={pinLabel}>
              <MapPin width={14} height={14} aria-hidden />
              PINNED
            </span>
          )}
        </span>
        <h1 className={title}>{notice.title}</h1>
        <div className={meta}>
          <time className={date} dateTime={notice.publish_at.replace(' ', 'T')}>
            {dotDate(notice.publish_at, true)}
          </time>
          <ShareBtn title={notice.title} />
        </div>
      </header>

      <section className={body}>
        {toBlocks(notice.content).map((b, i) => {
          switch (b.type) {
            case 'image':
              return <Image key={i} src={b.url} alt='' width={960} height={540} sizes='(max-width: 1023px) 100vw, 1072px' className={image} />;
            case 'head':
              return (
                <h2 key={i} className={heading}>
                  {b.text}
                </h2>
              );
            case 'quote':
              return (
                <blockquote key={i} className={quote}>
                  <Bold text={b.text} />
                </blockquote>
              );
            default:
              return (
                <p key={i} className={text}>
                  <Bold text={b.text} />
                </p>
              );
          }
        })}
        {Array.isArray(notice.list) && (
          <p className={text}>
            {notice.list.map((v, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {v}
              </React.Fragment>
            ))}
          </p>
        )}
      </section>

      <nav aria-label='이전·다음 공지' className={adjNav}>
        <Adjacent dir='NEXT' notice={next} />
        <Adjacent dir='PREV' notice={prev} />
      </nav>
      <Link href='/notice' className={listBtn}>
        LIST
      </Link>
    </article>
  );
}
