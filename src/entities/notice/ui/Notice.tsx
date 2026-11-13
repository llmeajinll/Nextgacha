import React from 'react';
import Link from 'next/link';
import { dotDate, type Notice as NoticeType } from '../model/types';
import NoticeTag from './NoticeTag';
import { row, tagCell, titleCell, title, newDesk, newMobile, date } from './notice.css';

// 공지 목록 한 줄. 웹은 한 줄, 모바일은 (분류·날짜) 위 / 제목 아래
export default function Notice({ props, isNew }: { props: NoticeType; isNew?: boolean }) {
  return (
    <Link href={`/notice/${props.num}`} className={row}>
      <span className={tagCell}>
        <NoticeTag category={props.category} />
        {isNew && <span className={newMobile}>NEW</span>}
      </span>
      <span className={titleCell}>
        <span className={title}>{props.title}</span>
        {isNew && <span className={newDesk}>NEW</span>}
      </span>
      <span className={date}>{dotDate(props.publish_at)}</span>
    </Link>
  );
}
