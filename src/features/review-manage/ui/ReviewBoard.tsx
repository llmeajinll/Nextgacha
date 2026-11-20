'use client';

import React, { useState } from 'react';
import { Search } from 'pixelarticons/react';
import { DropDown, Pagination } from '@/shared/ui';
import type { AdminReview } from '../model/types';
import { avgOf, fmt, isLow } from '../lib/reviewStats';
import ReviewCard from './ReviewCard';
import ReviewGroup from './ReviewGroup';
import ReviewSummary from './ReviewSummary';
import * as s from './reviewBoard.css';

const PRODUCT_PAGE = 10;
const FEED_PAGE = 12;

const PRODUCT_SORTS = [
  { value: 'low', label: '평균 별점 낮은 순' },
  { value: 'many', label: '리뷰 많은 순' },
  { value: 'recent', label: '최근 리뷰 순' },
];
const FEED_SORTS = [
  { value: 'new', label: '최신순' },
  { value: 'low', label: '별점 낮은 순' },
  { value: 'high', label: '별점 높은 순' },
];
const labelOf = (list: { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label;

export default function ReviewBoard({ reviews }: { reviews: AdminReview[] }) {
  const [view, setView] = useState<'product' | 'feed'>('product');
  // 상품별 보기
  const [pquery, setPquery] = useState('');
  const [psort, setPsort] = useState<'low' | 'many' | 'recent'>('low');
  const [ppage, setPpage] = useState(1);
  const [open, setOpen] = useState<number | null>(null);
  const [opt, setOpt] = useState('');
  const [rpage, setRpage] = useState(1);
  // 최신 리뷰 보기
  const [star, setStar] = useState(0);
  const [product, setProduct] = useState(0);
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new');
  const [page, setPage] = useState(1);

  // 렌더마다 시각이 바뀌지 않게 첫 렌더 기준
  const [weekAgo] = useState(() => new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));

  // 상품별 묶음
  const byNum = new Map<number, AdminReview[]>();
  for (const r of reviews) byNum.set(r.num, [...(byNum.get(r.num) ?? []), r]);
  const pq = pquery.trim().toLowerCase();
  const groups = [...byNum.entries()]
    .map(([num, rs]) => ({ num, name: rs[0].product || `${num}번 상품`, image: rs[0].image, rs, avg: avgOf(rs), low: rs.filter(isLow).length, latest: rs[0].created_at }))
    .filter((g) => !pq || g.name.toLowerCase().includes(pq))
    .sort((a, b) =>
      psort === 'many' ? b.rs.length - a.rs.length : psort === 'recent' ? b.latest.localeCompare(a.latest) : a.avg - b.avg,
    );
  const pLast = Math.max(Math.ceil(groups.length / PRODUCT_PAGE), 1);
  const pCur = Math.min(ppage, pLast);
  const shownGroups = groups.slice((pCur - 1) * PRODUCT_PAGE, pCur * PRODUCT_PAGE);

  // 최신 리뷰
  const filtered = reviews
    .filter((r) => (!star || r.rate === star) && (!product || r.num === product))
    .sort((a, b) => (sort === 'low' ? a.rate - b.rate : sort === 'high' ? b.rate - a.rate : 0) || b.created_at.localeCompare(a.created_at));
  const productOptions = [...byNum.entries()].map(([num, rs]) => ({ num, name: rs[0].product || `${num}번 상품` }));

  const toggleGroup = (num: number) => {
    setOpen(open === num ? null : num);
    setOpt('');
    setRpage(1);
  };

  return (
    <div className={s.container}>
      <ReviewSummary
        reviews={reviews}
        weekAgo={weekAgo}
        activeStar={view === 'feed' ? star : null}
        onPickStar={(n) => {
          setView('feed');
          setStar(n);
          setPage(1);
        }}
      />

      <div role='group' aria-label='보기 방식' className={s.utabs}>
        {(
          [
            ['product', '상품별'],
            ['feed', '최신 리뷰'],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type='button' aria-pressed={view === k} className={s.utab} onClick={() => setView(k)}>
            {label}
          </button>
        ))}
      </div>

      {view === 'product' ? (
        <>
          <div className={s.toolbar}>
            <label className={s.search}>
              <Search aria-hidden />
              <input
                type='search'
                value={pquery}
                onChange={(e) => {
                  setPquery(e.target.value);
                  setPpage(1);
                }}
                aria-label='상품명 검색'
                placeholder='상품명 검색'
                className={s.searchInput}
              />
            </label>
            <p className={s.muted} aria-live='polite'>
              {groups.length
                ? `상품 ${groups.length}개 중 ${(pCur - 1) * PRODUCT_PAGE + 1}–${Math.min(pCur * PRODUCT_PAGE, groups.length)}`
                : ''}
            </p>
            <DropDown
              label={labelOf(PRODUCT_SORTS, psort)}
              value={psort}
              placeholder='상품 정렬'
              options={PRODUCT_SORTS}
              onSelect={(v) => setPsort(v as typeof psort)}
              className={`${s.sortDrop} ${s.pushRight}`}
            />
          </div>

          <section aria-label='상품별 리뷰' className={s.groups}>
            {shownGroups.map((g) => (
              <ReviewGroup
                key={g.num}
                g={g}
                isOpen={open === g.num}
                opt={opt}
                setOpt={setOpt}
                rpage={rpage}
                setRpage={setRpage}
                toggleGroup={toggleGroup}
                weekAgo={weekAgo}
              />
            ))}
            {groups.length === 0 && (
              <div className={s.empty}>
                <span className={s.emptyPixel}>NO REVIEW</span>
                <span className={s.muted}>{pq ? '검색어에 맞는 상품이 없어요.' : '아직 리뷰가 없어요.'}</span>
              </div>
            )}
          </section>
          <Pagination current={pCur} total={groups.length} pageSize={PRODUCT_PAGE} onChange={setPpage} />
        </>
      ) : (
        <>
          <div className={s.toolbar}>
            <div role='group' aria-label='별점으로 거르기' className={s.tabs}>
              {[0, 5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  type='button'
                  aria-pressed={star === n}
                  className={s.tab}
                  onClick={() => {
                    setStar(n);
                    setPage(1);
                  }}
                >
                  {n ? `${n}점` : '전체'}
                </button>
              ))}
            </div>
            <DropDown
              label={productOptions.find((p) => p.num === product)?.name}
              value={String(product)}
              placeholder='전체 상품'
              options={[{ value: '0', label: '전체 상품' }, ...productOptions.map((p) => ({ value: String(p.num), label: p.name }))]}
              onSelect={(v) => {
                setProduct(Number(v));
                setPage(1);
              }}
              className={s.productDrop}
            />
            <DropDown
              label={labelOf(FEED_SORTS, sort)}
              value={sort}
              placeholder='정렬'
              options={FEED_SORTS}
              onSelect={(v) => {
                setSort(v as typeof sort);
                setPage(1);
              }}
              className={`${s.sortDrop} ${s.pushRight}`}
            />
          </div>
          <p className={s.muted} aria-live='polite'>
            {fmt(filtered.length)}개 리뷰{star ? ` · ${star}점` : ''}
            {product ? ` · ${productOptions.find((p) => p.num === product)?.name}` : ''}
          </p>
          {filtered.length > 0 ? (
            <section aria-label='리뷰 목록' className={s.feed}>
              {filtered.slice((page - 1) * FEED_PAGE, page * FEED_PAGE).map((r, i) => (
                <ReviewCard key={`${r.num}-${r.created_at}-${i}`} r={r} showProduct />
              ))}
            </section>
          ) : (
            <div className={s.empty}>
              <span className={s.emptyPixel}>NO REVIEW</span>
              <span className={s.muted}>조건에 맞는 리뷰가 없어요. 필터를 바꿔 보세요.</span>
            </div>
          )}
          <Pagination current={page} total={filtered.length} pageSize={FEED_PAGE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
