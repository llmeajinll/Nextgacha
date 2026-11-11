'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'pixelarticons/react';
import { Drawer, DropDown, Pagination } from '@/shared/ui';
import getUserDetail from '../api/getUserDetail';
import type { AdminUser } from '../model/types';
import * as s from './userManager.css';

const PAGE = 20;
const MAX_PER_ITEM = 5;

type Filter = 'all' | 'ordered' | 'none' | 'fresh';
type Sort = 'joined' | 'spent' | 'point';

const SORTS = [
  { value: 'joined', label: '최근 가입순' },
  { value: 'spent', label: '누적 결제 많은 순' },
  { value: 'point', label: '포인트 많은 순' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR');
const day = (v: string) => (v ?? '').slice(0, 10).replace(/-/g, '.');

export default function UserManager({ users }: { users: AdminUser[] }) {
  // 렌더마다 시각이 바뀌지 않게 첫 렌더 기준 (KST 'YYYY-MM')
  const [month] = useState(() => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 7));
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('joined');
  const [page, setPage] = useState(1);
  const [pick, setPick] = useState('');

  const isNew = (u: AdminUser) => u.created_at.slice(0, 7) === month;
  const FILTERS: { key: Filter; label: string; test: (u: AdminUser) => boolean }[] = [
    { key: 'all', label: '전체', test: () => true },
    { key: 'ordered', label: '주문 있음', test: (u) => u.orders > 0 },
    { key: 'none', label: '주문 없음', test: (u) => u.orders === 0 },
    { key: 'fresh', label: '이번 달 가입', test: isNew },
  ];

  const q = query.trim().toLowerCase();
  const test = FILTERS.find((f) => f.key === filter)!.test;
  const shown = users
    .filter(test)
    .filter((u) => !q || `${u.nickname} ${u.email}`.toLowerCase().includes(q))
    .sort((a, b) =>
      sort === 'spent' ? b.spent - a.spent : sort === 'point' ? b.point - a.point : b.created_at.localeCompare(a.created_at),
    );
  const last = Math.max(Math.ceil(shown.length / PAGE), 1);
  const cur = Math.min(page, last);
  const picked = users.find((u) => u.id === pick);

  const detail = useQuery({
    queryKey: ['adminUserDetail', pick],
    queryFn: () => getUserDetail(pick),
    enabled: !!pick,
  });
  const d = detail.data;

  return (
    <div className={s.container}>
      <section aria-label='회원 요약' className={s.tiles}>
        {[
          { label: '전체 회원', value: users.length, unit: '명' },
          { label: '이번 달 가입', value: users.filter(isNew).length, unit: '명' },
          { label: '주문한 회원', value: users.filter((u) => u.orders > 0).length, unit: '명' },
          { label: '지급된 포인트 잔액', value: users.reduce((a, u) => a + u.point, 0), unit: 'P' },
        ].map((t) => (
          <div key={t.label} className={s.tile}>
            <span className={s.muted}>{t.label}</span>
            <span className={s.tileNum}>
              {fmt(t.value)}
              <span className={s.tileUnit}>{t.unit}</span>
            </span>
          </div>
        ))}
      </section>

      <div className={s.toolbar}>
        <label className={s.search}>
          <Search aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label='회원 검색'
            placeholder='닉네임 또는 이메일'
            className={s.searchInput}
          />
        </label>
        <div role='group' aria-label='회원 필터' className={s.tabs}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type='button'
              aria-pressed={filter === f.key}
              className={s.tab}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
            >
              {f.label}
              <span className={s.tabCount}>{users.filter(f.test).length}</span>
            </button>
          ))}
        </div>
        <DropDown
          label={SORTS.find((x) => x.value === sort)?.label}
          value={sort}
          placeholder='정렬'
          options={SORTS}
          onSelect={(v) => {
            setSort(v as Sort);
            setPage(1);
          }}
          className={s.sortDrop}
        />
      </div>

      <section aria-label='회원 목록' className={s.panel}>
        <div className={s.scroll}>
          <div className={s.table}>
            <div className={`${s.grid} ${s.head}`} aria-hidden>
              <span>회원</span>
              <span className={s.center}>가입일</span>
              <span className={s.center}>주문</span>
              <span className={s.center}>누적 결제</span>
              <span className={s.center}>포인트</span>
            </div>
            {shown.slice((cur - 1) * PAGE, cur * PAGE).map((u) => (
              <button
                key={u.id}
                type='button'
                aria-pressed={u.id === pick}
                className={`${s.grid} ${s.row}`}
                onClick={() => setPick(u.id === pick ? '' : u.id)}
              >
                <span className={s.who}>
                  <span className={s.nickname}>
                    {u.nickname || '(닉네임 없음)'}
                    {u.admin && <span className={s.adminBadge}>ADMIN</span>}
                    {isNew(u) && <span className={s.newBadge}>NEW</span>}
                  </span>
                  <span className={s.email}>{u.email}</span>
                </span>
                <span className={s.center}>{day(u.created_at)}</span>
                <span className={s.center}>{fmt(u.orders)}건</span>
                <span className={s.center}>{fmt(u.spent)}원</span>
                <span className={s.center}>{fmt(u.point)}P</span>
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <div className={s.empty}>
            <span className={s.emptyTitle}>조건에 맞는 회원이 없어요.</span>
            <span className={s.muted}>검색어나 필터를 바꿔 보세요.</span>
          </div>
        ) : (
          <div className={s.foot}>
            <span className={s.muted} aria-live='polite'>
              전체 {fmt(shown.length)}명 중 {fmt((cur - 1) * PAGE + 1)}–{fmt(Math.min(cur * PAGE, shown.length))}
            </span>
            <Pagination current={cur} total={shown.length} pageSize={PAGE} onChange={setPage} />
          </div>
        )}
      </section>

      {picked && (
        <Drawer label='회원 상세' title='MEMBER DETAIL' onClose={() => setPick('')}>
          <section className={s.card}>
            <div className={s.profile}>
              <h2 className={s.profileName}>
                {picked.nickname || '(닉네임 없음)'}
                {picked.admin && <span className={s.adminBadge}>ADMIN</span>}
              </h2>
              <span className={s.email}>{picked.email} · 카카오</span>
            </div>
            <div className={s.stats}>
              <div className={s.stat}>
                <span className={s.muted}>주문</span>
                <span className={s.statNum}>{fmt(picked.orders)}건</span>
              </div>
              <div className={s.stat}>
                <span className={s.muted}>누적 결제</span>
                <span className={s.statNum}>{fmt(picked.spent)}원</span>
              </div>
              <div className={s.stat}>
                <span className={s.muted}>포인트</span>
                <span className={s.statPoint}>{fmt(picked.point)}P</span>
              </div>
            </div>
            <dl className={s.info}>
              <dt>가입일</dt>
              <dd>{day(picked.created_at)}</dd>
              <dt>배송지</dt>
              <dd>{d ? d.address || '—' : '…'}</dd>
              <dt>활동</dt>
              <dd>{d ? `리뷰 ${d.reviews} · 문의 ${d.qna} · 찜 ${d.likes}` : '…'}</dd>
            </dl>
          </section>

          {detail.isError && (
            <p role='status' className={s.errorText}>
              {detail.error.message}
            </p>
          )}

          <section aria-labelledby='keep-title' className={s.section}>
            <div className={s.sectionHead}>
              <h3 id='keep-title' className={s.sectionTitle}>
                보유 수량
              </h3>
              <span className={s.muted}>장바구니 + 진행 중 주문 합산, 같은 옵션은 최대 {MAX_PER_ITEM}개예요.</span>
            </div>
            {d?.keep.map((k) => {
              const full = k.count >= MAX_PER_ITEM;
              return (
                <div key={`${k.num}-${k.name}`} className={s.keepRow}>
                  <span className={s.keepTitle}>
                    {k.title} <span className={s.muted}>· {k.name}</span>
                  </span>
                  <span role='img' aria-label={`${MAX_PER_ITEM}개 중 ${k.count}개`} className={s.cells}>
                    {Array.from({ length: MAX_PER_ITEM }, (_, i) => (
                      <span key={i} className={s.cell[i < k.count ? (full ? 'full' : 'on') : full ? 'fullOff' : 'off']} />
                    ))}
                  </span>
                  <span className={full ? s.keepFull : s.keepCount}>
                    {k.count}/{MAX_PER_ITEM}
                  </span>
                </div>
              );
            })}
            {d && d.keep.length === 0 && <span className={s.muted}>담아 두거나 배송 중인 상품이 없어요.</span>}
          </section>

          <section aria-labelledby='recent-title' className={s.section}>
            <h3 id='recent-title' className={s.sectionTitle}>
              최근 주문
            </h3>
            {d?.recent.map((o) => (
              <Link
                key={o.orderId}
                href={`/manager/order/check?q=${encodeURIComponent(o.orderId)}`}
                className={s.orderRow}
              >
                <span className={s.orderTop}>
                  <span className={s.orderId}>{o.orderId}</span>
                  <span className={s.statusTag[o.status as keyof typeof s.statusTag] ?? s.statusTag['배송 완료']}>{o.status}</span>
                </span>
                <span className={s.orderSub}>
                  <span>{day(o.created_at)}</span>
                  <span>{fmt(o.totalPrice)}원</span>
                </span>
              </Link>
            ))}
            {d && d.recent.length === 0 && <span className={s.muted}>아직 주문이 없어요.</span>}
          </section>
        </Drawer>
      )}
    </div>
  );
}
