'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Plus, Search } from 'pixelarticons/react';
import { Pagination } from '@/shared/ui';
import {
  categoryLabel,
  NOTICE_CATEGORIES,
  NOTICE_STATUS_LABEL,
  nowKst,
  statusOf,
  type Notice,
  type NoticeStatus,
} from '@/entities/notice/model/types';
import NoticeEditor from './NoticeEditor';
import * as s from './noticeManager.css';

const PAGE = 10;
type Tab = NoticeStatus | 'all';
const TABS: { key: Tab; label: string }[] = [
  { key: 'live', label: '게시 중' },
  { key: 'soon', label: '예약' },
  { key: 'draft', label: '임시 저장' },
  { key: 'all', label: '전체' },
];

const dot = (v: string) => (v ?? '').slice(0, 10).replace(/-/g, '.');
// 이미지 줄을 뺀 본문 첫 줄
const previewOf = (n: Notice) =>
  n.content
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('![')) ?? '';

export default function NoticeManager({ notices }: { notices: Notice[] }) {
  const router = useRouter();
  const [now] = useState(() => nowKst());
  const [tab, setTab] = useState<Tab>('live');
  const [cat, setCat] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pick, setPick] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const q = query.trim().toLowerCase();
  const inTab = (n: Notice, k: Tab) => k === 'all' || statusOf(n, now) === k;
  const base = notices.filter((n) => inTab(n, tab)).filter((n) => !q || n.title.toLowerCase().includes(q));
  const shown = base.filter((n) => !cat || n.category === cat);
  const last = Math.max(Math.ceil(shown.length / PAGE), 1);
  const cur = Math.min(page, last);
  const picked = notices.find((n) => n.num === pick);
  const pinCount = notices.filter((n) => n.pinned && n.state === 'published' && n.num !== pick).length;

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <div className={s.titleText}>
          <span className={s.eyebrow}>NOTICES</span>
          <h1 className={s.title}>공지 관리</h1>
          <p className={s.subText}>쇼핑몰 공지사항을 쓰고 고쳐요. 중요한 공지는 상단에 고정하고, 미리 써 둔 공지는 예약해서 올릴 수 있어요.</p>
        </div>
        <Link href='/manager/notice/add' className={s.addBtn}>
          <Plus aria-hidden />
          NEW NOTICE
        </Link>
      </section>

      {toast && (
        <div role='status' className={s.toast}>
          {toast}
        </div>
      )}

      <div className={s.filters}>
        <div className={s.toolbar}>
          <div role='group' aria-label='공지 상태' className={s.tabs}>
            {TABS.map((t) => (
              <button
                key={t.key}
                type='button'
                aria-pressed={tab === t.key}
                className={s.tab}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
              >
                {t.label}
                <span className={s.tabCount}>{notices.filter((n) => inTab(n, t.key)).length}</span>
              </button>
            ))}
          </div>
          <label className={s.search}>
            <Search aria-hidden />
            <input
              type='search'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label='공지 제목 검색'
              placeholder='제목 검색'
              className={s.searchInput}
            />
          </label>
        </div>
        <div role='group' aria-label='분류' className={s.chips}>
          {[{ key: '', label: '전체' }, ...NOTICE_CATEGORIES].map((c) => (
            <button
              key={c.key || 'all'}
              type='button'
              aria-pressed={cat === c.key}
              className={s.chip}
              onClick={() => {
                setCat(c.key);
                setPage(1);
              }}
            >
              {c.label}
              <span className={s.chipCount}>{base.filter((n) => !c.key || n.category === c.key).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={s.layout}>
        <section aria-label='공지 목록' className={s.listCol}>
          <div className={s.panel}>
            <div className={s.scroll}>
              <div className={s.table}>
                <div className={`${s.grid} ${s.head}`} aria-hidden>
                  <span />
                  <span>분류</span>
                  <span>제목</span>
                  <span className={s.center}>상태</span>
                  <span className={s.center}>게시일</span>
                </div>
                {shown.slice((cur - 1) * PAGE, cur * PAGE).map((n) => {
                  const k = statusOf(n, now);
                  return (
                    <button
                      key={n.num}
                      type='button'
                      aria-pressed={n.num === pick}
                      aria-label={`${n.title} 수정`}
                      className={`${s.grid} ${s.row}`}
                      onClick={() => {
                        setPick(n.num === pick ? null : n.num);
                        setToast('');
                      }}
                    >
                      <span className={s.pinCell} title={n.pinned ? '상단 고정' : undefined}>
                        {n.pinned && <Bookmark aria-label='상단 고정' />}
                      </span>
                      <span>
                        <span className={s.catTag[n.category]}>{categoryLabel(n.category)}</span>
                      </span>
                      <span className={s.titleCell}>
                        <span className={n.pinned ? `${s.rowTitle} ${s.rowTitleBold}` : s.rowTitle}>{n.title}</span>
                        <span className={s.rowPreview}>{previewOf(n)}</span>
                      </span>
                      <span className={s.center}>
                        <span className={s.statusTag[k]}>{NOTICE_STATUS_LABEL[k]}</span>
                      </span>
                      <span className={`${s.center} ${s.date}`}>
                        {k === 'draft' ? '—' : dot(n.publish_at)}
                        {k === 'soon' && <span className={s.time}>{n.publish_at.slice(11)} 예정</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {shown.length === 0 && (
              <div className={s.empty}>
                {q || cat ? '조건에 맞는 공지가 없어요.' : `${TABS.find((t) => t.key === tab)!.label} 공지가 없어요.`}
              </div>
            )}
          </div>
          <div className={s.listFoot}>
            <span className={s.muted}>
              {shown.length ? `전체 ${shown.length}개 중 ${(cur - 1) * PAGE + 1}–${Math.min(cur * PAGE, shown.length)}` : ''}
            </span>
            <Pagination current={cur} total={shown.length} pageSize={PAGE} onChange={setPage} />
          </div>
        </section>

        <section aria-label='공지 수정' className={s.editor}>
          {!picked ? (
            <div className={s.noPick}>왼쪽에서 공지를 고르면 여기서 고칠 수 있어요. 새 공지는 NEW NOTICE로 써요.</div>
          ) : (
            <>
              <div className={s.editorHead}>
                <h2 className={s.editorTitle}>공지 수정</h2>
                <span className={s.statusTag[statusOf(picked, now)]}>{NOTICE_STATUS_LABEL[statusOf(picked, now)]}</span>
              </div>
              <div className={s.editorBody}>
                <NoticeEditor
                  key={picked.num}
                  initial={picked}
                  pinCount={pinCount}
                  onCancel={() => setPick(null)}
                  onDone={(message, num) => {
                    setToast(message);
                    setPick(num);
                    router.refresh();
                  }}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
