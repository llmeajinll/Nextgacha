'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Close, Search } from 'pixelarticons/react';
import { DropDown, Pagination, Tag } from '@/shared/ui';
import getAllProducts from '@/entities/product/api/getAllProducts';
import getCategoryMenu from '@/entities/product/api/getCategoryMenu';
import type { CardProps } from '@/entities/product/model/types';
import postEvent from '@/features/product-manage/api/postEvent';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import { vars } from '@/styles/theme.css';
import * as s from './page.css';

const PAGE_SIZE = 20;
const PRESETS = [10, 20, 30, 50];

type Filter = 'all' | 'on' | 'off';
const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'on', label: '할인 중' },
  { key: 'off', label: '할인 없음' },
];

// 쇼핑몰 카드와 같은 계산
const saleOf = (price: number, rate: number) => comma(price * (1 - rate / 100));
const discountOf = (p: CardProps) => (p.isDiscount ? p.discount : 0);

export default function EventPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isPending } = useQuery({ queryKey: ['manageProducts'], queryFn: getAllProducts });
  const { data: menu } = useQuery({ queryKey: ['categoryMenu'], queryFn: getCategoryMenu });

  const [group, setGroup] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  // 카테고리·검색을 바꿔도 고른 상품은 남긴다
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [skipReserve, setSkipReserve] = useState(true);
  const [rate, setRate] = useState('20');
  const [rateError, setRateError] = useState(false);
  const [confirming, setConfirming] = useState<'' | 'apply' | 'clear'>('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const rateNum = Number(rate);
  const rateOk = Number.isInteger(rateNum) && rateNum >= 1 && rateNum <= 99;

  const q = query.trim().toLowerCase();
  const matched = products.filter(
    (p) => (!group || p.group?.includes(group)) && (!q || p.title.toLowerCase().includes(q) || String(p.num) === q),
  );
  const counts = {
    all: matched.length,
    on: matched.filter((p) => discountOf(p) > 0).length,
    off: matched.filter((p) => discountOf(p) === 0).length,
  };
  const shown = matched.filter((p) => (filter === 'on' ? discountOf(p) > 0 : filter === 'off' ? discountOf(p) === 0 : true));
  const lastPage = Math.max(Math.ceil(shown.length / PAGE_SIZE), 1);
  const curPage = Math.min(page, lastPage);
  const pageItems = shown.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  const pickable = pageItems.filter((p) => !(skipReserve && p.reserve));
  const pageChecked = pickable.length > 0 && pickable.every((p) => checked.has(p.num));
  const selected = products.filter((p) => checked.has(p.num));
  const withDiscount = selected.filter((p) => discountOf(p) > 0);
  const reserveCount = selected.filter((p) => p.reserve).length;

  const groupOptions = [
    { value: '', label: '전체 카테고리' },
    ...(menu
      ? [
          ...menu.character.map((v) => ({ value: v, label: v, group: '캐릭터' })),
          ...menu.ani.map((v) => ({ value: v, label: v, group: '애니메이션' })),
          ...menu.series.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: `시리즈 · ${m.name}` }))),
          ...menu.groups.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: m.name }))),
        ]
      : []),
  ];

  const select = (next: Set<number>) => {
    setChecked(next);
    setConfirming('');
    setToast('');
    setError('');
  };
  const toggle = (num: number) => {
    const next = new Set(checked);
    if (!next.delete(num)) next.add(num);
    select(next);
  };

  const run = async () => {
    const discount = confirming === 'apply' ? rateNum : 0;
    const nums = (confirming === 'apply' ? selected : withDiscount).map((p) => p.num);
    setSending(true);
    setError('');
    try {
      await postEvent({ discount, nums });
      queryClient.setQueryData<CardProps[]>(['manageProducts'], (prev) =>
        prev?.map((p) => (nums.includes(p.num) ? { ...p, discount, isDiscount: discount > 0 } : p)),
      );
      setToast(
        discount ? `${nums.length}개 상품에 ${discount}% 할인을 걸었어요.` : `${nums.length}개 상품의 할인을 내렸어요.`,
      );
      setChecked(new Set());
      setConfirming('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={s.container}>
      <section className={`${s.titleText} ${s.titleSection}`}>
        <span className={s.eyebrow}>EVENTS</span>
        <h1 className={s.title}>이벤트 관리</h1>
        <p className={s.subText}>
          여러 상품에 할인을 한 번에 걸거나 내려요. 고른 상품은 다른 카테고리로 옮겨 가도 그대로 남아 있어요.
        </p>
      </section>

      <div className={s.toolbar}>
        <DropDown
          label={group}
          placeholder='전체 카테고리'
          options={groupOptions}
          onSelect={(v) => {
            setGroup(v);
            setPage(1);
          }}
          className={s.groupDrop}
        />
        <label className={`${s.search} ${s.searchGrow}`}>
          <Search aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label='상품명 검색'
            placeholder='상품명 검색'
            className={s.searchInput}
          />
        </label>
        <div role='group' aria-label='할인 상태로 거르기' className={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type='button'
              aria-pressed={filter === t.key}
              className={filter === t.key ? `${s.tab} ${s.tabOn}` : s.tab}
              onClick={() => {
                setFilter(t.key);
                setPage(1);
              }}
            >
              {t.label}
              <span className={s.tabCount}>{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div role='status' className={s.saved}>
          {toast}
        </div>
      )}

      <div className={s.layout}>
        <section aria-label='상품 목록' className={s.listCol}>
          <div className={s.panel}>
            <div className={s.listHead}>
              <label className={s.checkLabel}>
                <span className={s.checkCell}>
                  <input
                    type='checkbox'
                    checked={pageChecked}
                    onChange={() => {
                      const next = new Set(checked);
                      for (const p of pickable) {
                        if (pageChecked) next.delete(p.num);
                        else next.add(p.num);
                      }
                      select(next);
                    }}
                    className={s.checkInput}
                  />
                </span>
                이 페이지 전체 선택
              </label>
              <label className={s.subCheckLabel}>
                <input
                  type='checkbox'
                  checked={skipReserve}
                  onChange={() => setSkipReserve(!skipReserve)}
                  className={s.checkInput}
                />
                예약 상품은 전체 선택에서 빼기
              </label>
            </div>
            <div className={s.scroll}>
              <div className={s.table}>
                <div className={s.head}>
                  <span />
                  <span>PRODUCT</span>
                  <span className={s.right}>PRICE</span>
                  <span className={s.right}>NOW</span>
                  <span className={s.right}>AFTER</span>
                </div>
                {pageItems.map((p) => {
                  const on = checked.has(p.num);
                  const cur = discountOf(p);
                  return (
                    <label key={p.num} className={on ? `${s.row} ${s.rowOn}` : s.row}>
                      <span className={s.checkCell}>
                        <input
                          type='checkbox'
                          checked={on}
                          onChange={() => toggle(p.num)}
                          aria-label={`${p.title} 선택`}
                          className={s.checkInput}
                        />
                      </span>
                      <div className={s.product}>
                        <Image
                          src={p.image?.[0] || '/images/defaultImg.png'}
                          alt=''
                          width={52}
                          height={52}
                          className={s.thumb}
                        />
                        <div className={s.productText}>
                          <span className={s.titleLine}>
                            <span className={s.num}>{p.num}</span>
                            <span className={s.productTitle}>{p.title}</span>
                          </span>
                          {(p.reserve || cur > 0) && (
                            <div className={s.tags}>
                              {p.reserve && (
                                <Tag
                                  word={`${toKoreaTime(p.reserve).format('YYYY년 MM월')} 예약`}
                                  color={vars.status.reserve}
                                />
                              )}
                              {cur > 0 && <Tag word={`${cur}% 할인 중`} color='#DDF0FD' />}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={s.right}>{comma(p.price)}원</span>
                      <span className={`${s.right} ${cur ? s.now : s.muted}`}>{cur ? `${cur}%` : '—'}</span>
                      {on && rateOk ? (
                        <span className={s.after}>
                          <span className={s.afterNew}>{saleOf(p.price, rateNum)}원</span>
                          <span className={s.afterSub}>{rateNum}% 적용</span>
                        </span>
                      ) : (
                        <span className={`${s.right} ${cur ? '' : s.muted}`}>
                          {cur ? `${saleOf(p.price, cur)}원` : '—'}
                        </span>
                      )}
                    </label>
                  );
                })}
                {!isPending && shown.length === 0 && (
                  <div className={s.empty}>
                    <span className={s.emptyTitle}>조건에 맞는 상품이 없어요.</span>
                    <span>검색어를 바꾸거나 다른 카테고리를 골라 보세요.</span>
                  </div>
                )}
                {isPending && <div className={s.empty}>불러오는 중…</div>}
              </div>
            </div>
          </div>

          <Pagination current={curPage} total={shown.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>

        <aside aria-label='할인 적용' className={s.side}>
          <div className={s.sideHead}>
            <span className={s.sideKind}>DISCOUNT</span>
            <span className={s.sideCount} aria-live='polite'>
              {selected.length
                ? `${selected.length}개 선택${reserveCount ? ` · 예약 ${reserveCount}` : ''}`
                : '선택 없음'}
            </span>
          </div>

          <div className={s.sideBody}>
            <div className={s.field}>
              <label htmlFor='ev-rate' className={s.label}>
                할인율 <span className={s.hint}>1~99%</span>
              </label>
              <div className={s.rateRow}>
                <input
                  id='ev-rate'
                  type='number'
                  min={1}
                  max={99}
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value);
                    setRateError(false);
                    setConfirming('');
                  }}
                  placeholder='0'
                  aria-invalid={rateError}
                  className={rateError ? `${s.rateInput} ${s.inputError}` : s.rateInput}
                />
                <span className={s.unit}>%</span>
              </div>
              <div role='group' aria-label='자주 쓰는 할인율' className={s.presets}>
                {PRESETS.map((r) => (
                  <button
                    key={r}
                    type='button'
                    aria-pressed={rateNum === r}
                    className={rateNum === r ? `${s.preset} ${s.presetOn}` : s.preset}
                    onClick={() => {
                      setRate(String(r));
                      setRateError(false);
                      setConfirming('');
                    }}
                  >
                    {r}%
                  </button>
                ))}
              </div>
              {rateError && (
                <span role='status' className={s.errorText}>
                  할인율은 1에서 99 사이로 입력해 주세요.
                </span>
              )}
            </div>

            <div className={s.field}>
              <div className={s.selHead}>
                <span className={s.label}>고른 상품</span>
                {selected.length > 0 && (
                  <button type='button' className={s.linkBtn} onClick={() => select(new Set())}>
                    모두 빼기
                  </button>
                )}
              </div>
              {selected.length > 0 ? (
                <ul className={s.selList}>
                  {selected.map((p) => (
                    <li key={p.num} className={s.selItem}>
                      <span className={s.num}>{p.num}</span>
                      <span className={s.selTitle}>{p.title}</span>
                      <span className={s.selPrice}>{saleOf(p.price, rateOk ? rateNum : 0)}원</span>
                      <button
                        type='button'
                        className={s.removeBtn}
                        onClick={() => toggle(p.num)}
                        aria-label={`${p.title} 빼기`}
                        title={`${p.title} 빼기`}
                      >
                        <Close aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={s.selEmpty}>왼쪽 목록에서 할인할 상품을 골라 주세요.</div>
              )}
              {withDiscount.length > 0 && rateOk && (
                <span className={s.overwrite}>
                  이미 할인 중인 {withDiscount.length}개는 {rateNum}%로 바뀌어요. (
                  {withDiscount.map((p) => `${discountOf(p)}%`).join(', ')} → {rateNum}%)
                </span>
              )}
            </div>

            {confirming && (
              <div className={confirming === 'clear' ? `${s.confirm} ${s.confirmDanger}` : s.confirm}>
                <span>
                  {confirming === 'apply'
                    ? `고른 ${selected.length}개 상품에 ${rateNum}% 할인을 걸까요? 쇼핑몰에 바로 보여요.`
                    : `할인 중인 ${withDiscount.length}개 상품의 할인을 내릴까요? 정가로 돌아가요.`}
                </span>
                <div className={s.confirmBtns}>
                  <button type='button' className={s.ghostBtn} onClick={() => setConfirming('')}>
                    취소
                  </button>
                  <button
                    type='button'
                    disabled={sending}
                    className={confirming === 'clear' ? `${s.runBtn} ${s.runDanger}` : s.runBtn}
                    onClick={run}
                  >
                    {sending ? '반영하는 중…' : confirming === 'clear' ? '할인 내리기' : '할인 걸기'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p role='status' className={s.sideError}>
                {error}
              </p>
            )}

            <div className={s.actions}>
              <button
                type='button'
                disabled={selected.length === 0}
                className={s.applyBtn}
                onClick={() => {
                  if (!rateOk) {
                    setRateError(true);
                    setConfirming('');
                    return;
                  }
                  setConfirming('apply');
                  setToast('');
                }}
              >
                APPLY
              </button>
              <button
                type='button'
                disabled={withDiscount.length === 0}
                className={s.clearBtn}
                onClick={() => {
                  setConfirming('clear');
                  setToast('');
                }}
              >
                고른 상품 할인 내리기
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
