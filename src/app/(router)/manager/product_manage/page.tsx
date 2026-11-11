'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search } from 'pixelarticons/react';
import { Pagination } from '@/shared/ui';
import getAllProducts from '@/entities/product/api/getAllProducts';
import type { CardProps } from '@/entities/product/model/types';
import ProductManageRow, {
  ProductManageHead,
  statusOf,
  type ProductStatus,
} from '@/features/product-manage/ui/ProductManageRow';
import { Btn } from '@/shared/ui';
import * as s from './page.css';

const PAGE_SIZE = 20;

const TABS: { key: 'all' | ProductStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'sale', label: '판매 중' },
  { key: 'reserve', label: '예약' },
  { key: 'soldout', label: '품절' },
];

export default function ProductManagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products = [], isPending } = useQuery({
    queryKey: ['manageProducts'],
    queryFn: getAllProducts,
  });

  const [tab, setTab] = useState<'all' | ProductStatus>('all');
  const [query, setQuery] = useState('');
  const [editNum, setEditNum] = useState<number | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [page, setPage] = useState(1);

  const counts = { all: products.length, sale: 0, reserve: 0, soldout: 0 };
  products.forEach((p) => counts[statusOf(p)]++);

  const q = query.trim().toLowerCase();
  const shown = products.filter(
    (p) => (tab === 'all' || statusOf(p) === tab) && (!q || p.title.toLowerCase().includes(q)),
  );
  const tabLabel = TABS.find((t) => t.key === tab)!.label;
  // 탭·검색을 바꿔 결과가 줄어도 빈 페이지에 머물지 않게
  const lastPage = Math.max(Math.ceil(shown.length / PAGE_SIZE), 1);
  const curPage = Math.min(page, lastPage);
  const pageItems = shown.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <div className={s.titleText}>
          <span className={s.eyebrow}>PRODUCTS</span>
          <h1 className={s.title}>상품 관리</h1>
          <p className={s.subText}>
            등록된 상품의 가격, 할인율, 옵션별 재고를 고쳐요. 수정을 누르면 그 자리에서 바로 바꿀 수 있어요.
          </p>
        </div>
        <Btn kind='primary' scale='l' px onClick={() => router.push('/manager/product_add')}>
          ADD PRODUCT
        </Btn>
      </section>

      <div className={s.toolbar}>
        <div role='group' aria-label='상태로 거르기' className={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type='button'
              aria-pressed={tab === t.key}
              className={tab === t.key ? `${s.tab} ${s.tabOn}` : s.tab}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
            >
              {t.label}
              <span className={s.tabCount}>{counts[t.key]}</span>
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
            aria-label='상품명 검색'
            placeholder='상품명 검색'
            className={s.searchInput}
          />
        </label>
      </div>

      {savedMsg && (
        <div role='status' className={s.saved}>
          {savedMsg}
        </div>
      )}

      <section aria-label='상품 목록' className={s.panel}>
        <div className={s.panelHead}>
          <h2 className={s.panelTitle}>{tab === 'all' ? '전체 상품' : `${tabLabel} 상품`}</h2>
          <span className={s.panelCount} aria-live='polite'>
            {shown.length}개
          </span>
        </div>
        <div className={s.scroll}>
          <div className={s.table}>
            <ProductManageHead />
            {pageItems.map((p) => (
              <ProductManageRow
                key={p.num}
                product={p}
                editing={editNum === p.num}
                onToggle={() => {
                  setSavedMsg('');
                  setEditNum(editNum === p.num ? null : p.num);
                }}
                onSaved={(next) => {
                  queryClient.setQueryData<CardProps[]>(['manageProducts'], (prev) =>
                    prev?.map((x) => (x.num === next.num ? next : x)),
                  );
                  setEditNum(null);
                  setSavedMsg(`저장했어요 · ${next.title}`);
                }}
              />
            ))}
            {!isPending && shown.length === 0 && (
              <div className={s.empty}>
                <span className={s.emptyTitle}>조건에 맞는 상품이 없어요.</span>
                <span>검색어를 바꾸거나 다른 상태를 골라 보세요.</span>
              </div>
            )}
            {isPending && <div className={s.empty}>불러오는 중…</div>}
          </div>
        </div>
      </section>

      <Pagination
        current={curPage}
        total={shown.length}
        pageSize={PAGE_SIZE}
        onChange={(next) => {
          setPage(next);
          setEditNum(null);
        }}
      />
    </div>
  );
}
