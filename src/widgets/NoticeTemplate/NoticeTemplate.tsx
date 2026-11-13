'use client';

import React, { useState } from 'react';
import { Search } from 'pixelarticons/react';
import Notice from '@/entities/notice/ui/Notice';
import PinnedNotice from '@/entities/notice/ui/PinnedNotice';
import { NOTICE_CATEGORIES, isNewNotice, type Notice as NoticeType, type NoticeCategory } from '@/entities/notice/model/types';
import { Pagination } from '@/shared/ui';
import { utab } from '@/styles/ui.css';
import { pageWrap, head, eyebrow, heading, searchBox, searchInput, pinnedGrid, tabs, list, empty, emptyTitle, paginationWrap } from './noticeTemplate.css';

const PAGE_SIZE = 10;

// 제목 검색 · 고정 공지 카드 · 분류 탭 · 목록. 고정 공지는 목록과 따로 맨 위에 두고, 검색 중에는 숨긴다
export default function NoticeTemplate({ notices }: { notices: NoticeType[] }) {
  const [category, setCategory] = useState<NoticeCategory | ''>('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const matched = notices.filter((n) => !q || n.title.toLowerCase().includes(q));
  const pinned = q ? [] : matched.filter((n) => n.pinned);
  const rest = matched.filter((n) => !n.pinned && (!category || n.category === category));
  const rows = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const latest = notices.reduce((m, n) => (n.publish_at > m ? n.publish_at : m), '');

  return (
    <div className={pageWrap}>
      <section className={head}>
        <div>
          <span className={eyebrow}>NOTICE</span>
          <h1 className={heading}>공지사항</h1>
        </div>
        <label className={searchBox}>
          <Search width={20} height={20} aria-hidden />
          <input
            type='search'
            className={searchInput}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label='공지 검색'
            placeholder='공지 제목 검색'
          />
        </label>
      </section>

      {pinned.length > 0 && (
        <section aria-label='고정 공지' className={pinnedGrid}>
          {pinned.map((n) => (
            <PinnedNotice key={n.num} notice={n} />
          ))}
        </section>
      )}

      <div role='group' aria-label='분류' className={tabs}>
        {[{ key: '', label: '전체' }, ...NOTICE_CATEGORIES].map((c) => (
          <button
            key={c.key}
            type='button'
            className={utab}
            aria-pressed={category === c.key}
            onClick={() => {
              setCategory(c.key as NoticeCategory | '');
              setPage(1);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section aria-label='공지 목록' className={list}>
        {rows.map((n) => (
          <Notice key={n.num} props={n} isNew={isNewNotice(n, latest)} />
        ))}
        {rows.length === 0 && (
          <div className={empty}>
            <span className={emptyTitle}>NO RESULT</span>
            <span>{q ? `“${query.trim()}”에 맞는 공지가 없어요.` : '이 분류의 공지가 아직 없어요.'}</span>
          </div>
        )}
      </section>

      <Pagination className={paginationWrap} current={page} total={rest.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
