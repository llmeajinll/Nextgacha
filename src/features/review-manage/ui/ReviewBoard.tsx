'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'pixelarticons/react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { DropDown, Pagination } from '@/shared/ui';
import type { AdminReview } from '../model/types';
import * as s from './reviewBoard.css';

const PRODUCT_PAGE = 10;
const GROUP_PAGE = 6;
const FEED_PAGE = 12;

const day = (v: string) => (v ?? '').slice(0, 10).replace(/-/g, '.');
const avgOf = (rs: AdminReview[]) => (rs.length ? rs.reduce((a, x) => a + x.rate, 0) / rs.length : 0);
const isLow = (r: AdminReview) => r.rate <= 2;
const fmt = (n: number) => n.toLocaleString('ko-KR');

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

// 꽉 찬 픽셀 별 (pixelarticons Star는 테두리만 있어서 채움색이 안 보임). 디자인 "상태 바 정리 · 별점"과 같은 모양
const STAR_PATH =
  'M10 0h4v4h-4zM8 4h8v4h-8zM0 8h24v2h-24zM2 10h20v2h-20zM4 12h16v2h-16zM6 14h12v2h-12zM4 16h16v2h-16zM4 18h6v2h-6zM14 18h6v2h-6zM2 20h6v2h-6zM16 20h6v2h-6zM2 22h4v2h-4zM18 22h4v2h-4z';

// 픽셀 별 5개. 1~2점은 빨강
function Stars({ value, size }: { value: number; size: number }) {
  const n = Math.round(value);
  const low = n > 0 && n <= 2;
  return (
    <span role='img' aria-label={`5점 만점에 ${value.toFixed(1)}점`} className={s.stars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox='0 0 24 24'
          shapeRendering='crispEdges'
          aria-hidden
          className={s.star[i < n ? (low ? 'low' : 'on') : low ? 'lowOff' : 'off']}
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ r, showProduct }: { r: AdminReview; showProduct?: boolean }) {
  return (
    <article className={s.card}>
      <div className={s.cardBody}>
        <div className={s.cardHead}>
          <span className={s.rateNum}>{r.rate}.0</span>
          <Stars value={r.rate} size={14} />
          <span className={s.date}>{day(r.created_at)}</span>
        </div>
        <span className={s.optionLine}>
          {r.options.length > 0 && <span className={s.optionTag}>{r.options.join(', ')}</span>}
          {showProduct && <span className={s.ellipsis}>{r.product}</span>}
        </span>
        <p className={s.content}>{r.content}</p>
      </div>
      <div className={s.cardFoot}>{r.writer}</div>
    </article>
  );
}

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

  const avg = avgOf(reviews);
  // 렌더마다 시각이 바뀌지 않게 첫 렌더 기준
  const [weekAgo] = useState(() => new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rate === n).length }));
  const maxDist = Math.max(...dist.map((d) => d.count), 1);

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
      <section aria-label='리뷰 요약' className={s.summary}>
        <div className={s.avgBox}>
          <div className={s.avgText}>
            <span className={s.muted}>평균 별점</span>
            <span className={s.avgNum}>{avg.toFixed(1)}</span>
            <Stars value={avg} size={16} />
          </div>
          <div className={s.dist}>
            {dist.map((d) => (
              <button
                key={d.n}
                type='button'
                aria-pressed={view === 'feed' && star === d.n}
                aria-label={`${d.n}점 리뷰 ${d.count}개 보기`}
                className={s.distRow}
                onClick={() => {
                  setView('feed');
                  setStar(d.n);
                  setPage(1);
                }}
              >
                <span className={s.distN}>{d.n}</span>
                <span className={s.distTrack}>
                  <span
                    className={d.n <= 2 ? s.distFillLow : s.distFill}
                    style={assignInlineVars({ [s.barWidth]: `${Math.round((d.count / maxDist) * 100)}%` })}
                  />
                </span>
                <span className={s.distCount}>{d.count}</span>
              </button>
            ))}
          </div>
        </div>
        {[
          { label: '전체 리뷰', value: reviews.length },
          { label: '최근 7일', value: reviews.filter((r) => r.created_at.slice(0, 10) >= weekAgo).length },
          { label: '낮은 별점 (1~2점)', value: reviews.filter(isLow).length },
        ].map((t) => (
          <div key={t.label} className={s.tile}>
            <span className={s.muted}>{t.label}</span>
            <span className={s.tileNum}>
              {fmt(t.value)}
              <span className={s.tileUnit}>개</span>
            </span>
          </div>
        ))}
      </section>

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
            {shownGroups.map((g) => {
              const isOpen = open === g.num;
              const pct = (n: number) => `${g.rs.length ? Math.round((n / g.rs.length) * 100) : 0}%`;
              const good = g.rs.filter((r) => r.rate >= 4).length;
              const opts = [...new Set(g.rs.flatMap((r) => r.options))].sort();
              const inOpt = isOpen && opt ? g.rs.filter((r) => r.options.includes(opt)) : g.rs;
              // 확인이 필요한 순: 최근 7일 안의 1~2점 → 나머지 1~2점 → 최신
              const rank = (r: AdminReview) => (isLow(r) ? (r.created_at.slice(0, 10) >= weekAgo ? 0 : 1) : 2);
              const sorted = [...inOpt].sort((a, b) => rank(a) - rank(b) || b.created_at.localeCompare(a.created_at));
              const rLast = Math.max(Math.ceil(sorted.length / GROUP_PAGE), 1);
              const rCur = isOpen ? Math.min(rpage, rLast) : 1;
              return (
                <article key={g.num} className={s.group}>
                  <button type='button' aria-expanded={isOpen} className={s.groupHead} onClick={() => toggleGroup(g.num)}>
                    <Image src={g.image || '/images/defaultImg.png'} alt='' width={52} height={52} className={s.groupThumb} />
                    <span className={s.groupText}>
                      <span className={s.groupName}>{g.name}</span>
                      <span className={s.muted}>
                        리뷰 {g.rs.length}개 · 최근 {day(g.latest)}
                      </span>
                    </span>
                    <span className={s.groupAvg}>
                      <span className={s.groupAvgNum}>{g.avg.toFixed(1)}</span>
                      <Stars value={g.avg} size={12} />
                    </span>
                    <span
                      role='img'
                      aria-label={`4~5점 ${good}개, 3점 ${g.rs.length - good - g.low}개, 1~2점 ${g.low}개`}
                      className={s.mix}
                    >
                      <span className={s.mixGood} style={assignInlineVars({ [s.barWidth]: pct(good) })} />
                      <span className={s.mixMid} style={assignInlineVars({ [s.barWidth]: pct(g.rs.length - good - g.low) })} />
                      <span className={s.mixLow} style={assignInlineVars({ [s.barWidth]: pct(g.low) })} />
                    </span>
                    <span className={g.low ? s.lowTag : s.noLowTag}>{g.low ? `낮은 별점 ${g.low}` : '낮은 별점 없음'}</span>
                    <ChevronDown aria-hidden className={isOpen ? s.chevOpen : s.chev} />
                  </button>

                  {isOpen && (
                    <div className={s.groupBody}>
                      {opts.length > 0 && (
                        <div className={s.options}>
                          <span className={s.pixelLabel}>OPTIONS</span>
                          <div role='group' aria-label='옵션으로 거르기' className={s.chips}>
                            {['', ...opts].map((o) => {
                              const rs = o ? g.rs.filter((r) => r.options.includes(o)) : g.rs;
                              return (
                                <button
                                  key={o || 'all'}
                                  type='button'
                                  aria-pressed={opt === o}
                                  className={s.chip}
                                  onClick={() => {
                                    setOpt(o);
                                    setRpage(1);
                                  }}
                                >
                                  <span>{o || '전체'}</span>
                                  <span className={s.chipCount}>{avgOf(rs).toFixed(1)}</span>
                                  <span className={s.chipSub}>{rs.length}개</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className={s.cards}>
                        {sorted.slice((rCur - 1) * GROUP_PAGE, rCur * GROUP_PAGE).map((r, i) => (
                          <ReviewCard key={`${r.created_at}-${i}`} r={r} />
                        ))}
                      </div>
                      <div className={s.groupFoot}>
                        <span className={s.muted}>
                          전체 {fmt(sorted.length)}개 중 {(rCur - 1) * GROUP_PAGE + 1}–{Math.min(rCur * GROUP_PAGE, sorted.length)} ·
                          확인이 필요한 순 (최근 1~2점 → 1~2점 → 최신)
                        </span>
                        {rLast > 1 && (
                          <div className={s.pager}>
                            <button
                              type='button'
                              aria-label='이전 리뷰'
                              disabled={rCur <= 1}
                              className={s.iconBtn}
                              onClick={() => setRpage(rCur - 1)}
                            >
                              <ChevronLeft aria-hidden />
                            </button>
                            <span className={s.pageText}>
                              {rCur} / {rLast}
                            </span>
                            <button
                              type='button'
                              aria-label='다음 리뷰'
                              disabled={rCur >= rLast}
                              className={s.iconBtn}
                              onClick={() => setRpage(rCur + 1)}
                            >
                              <ChevronRight aria-hidden />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
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
