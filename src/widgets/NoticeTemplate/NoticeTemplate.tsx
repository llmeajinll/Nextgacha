'use client';

import React, { Fragment, useState } from 'react';
import Notice from '@/entities/notice/ui/Notice';
import type { Notice as NoticeType } from '@/entities/notice/model/types';
import { Pagination } from '@/shared/ui';
import { pageWrap, listWrap, firstItem, divider, paginationWrap } from './noticeTemplate.css';

const PAGE_SIZE = 14;

// 고정 공지는 매 페이지 맨 위에, 나머지는 최근 게시 순으로 나눠 보여줌
export default function NoticeTemplate({ notices }: { notices: NoticeType[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pinned = notices.filter((n) => n.pinned);
  const rest = notices.filter((n) => !n.pinned);
  const page = rest.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={pageWrap}>
      <div className={listWrap}>
        {pinned.map((v) => (
          <Fragment key={v.num}>
            <div className={firstItem}>
              <Notice props={v} />
            </div>
            <div className={divider}></div>
          </Fragment>
        ))}
        {page.map((v, i) => (
          <Fragment key={v.num}>
            <Notice props={v} />
            {i !== page.length - 1 && <div className={divider}></div>}
          </Fragment>
        ))}
      </div>
      <Pagination
        className={paginationWrap}
        current={currentPage}
        total={rest.length}
        pageSize={PAGE_SIZE}
        onChange={setCurrentPage}
      />
    </div>
  );
}
