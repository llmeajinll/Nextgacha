import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import getAllProducts from '@/entities/product/api/getAllProducts';
import getCategoryMenu from '@/entities/product/api/getCategoryMenu';
import { categoryOptions } from '@/entities/product/lib/categoryOptions';
import type { CardProps } from '@/entities/product/model/types';
import postEvent from '../api/postEvent';
import { discountOf } from '../lib/discount';

export const EVENT_PAGE_SIZE = 20;
export type EventFilter = 'all' | 'on' | 'off';

// 이벤트 관리(할인 일괄 적용) 화면 상태
export default function useDiscountEvent() {
  const queryClient = useQueryClient();
  const { data: products = [], isPending } = useQuery({ queryKey: ['manageProducts'], queryFn: getAllProducts });
  const { data: menu } = useQuery({ queryKey: ['categoryMenu'], queryFn: getCategoryMenu });

  const [group, setGroup] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<EventFilter>('all');
  const [page, setPage] = useState(1);
  // 카테고리·검색을 바꿔도 고른 상품은 남긴다
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [skipReserve, setSkipReserve] = useState(true);
  const [rate, setRate] = useState('20');
  const [rateError, setRateError] = useState(false);
  // 할인 기간 'YYYY-MM-DD' (KST). 둘 다 비우면 내릴 때까지 계속
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const periodBad = !!start !== !!end || (!!start && !!end && end < start);
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
  const shown = matched.filter((p) =>
    filter === 'on' ? discountOf(p) > 0 : filter === 'off' ? discountOf(p) === 0 : true,
  );
  const lastPage = Math.max(Math.ceil(shown.length / EVENT_PAGE_SIZE), 1);
  const curPage = Math.min(page, lastPage);
  const pageItems = shown.slice((curPage - 1) * EVENT_PAGE_SIZE, curPage * EVENT_PAGE_SIZE);

  const pickable = pageItems.filter((p) => !(skipReserve && p.reserve));
  const pageChecked = pickable.length > 0 && pickable.every((p) => checked.has(p.num));
  const selected = products.filter((p) => checked.has(p.num));
  const withDiscount = selected.filter((p) => discountOf(p) > 0);
  const reserveCount = selected.filter((p) => p.reserve).length;

  const groupOptions = [{ value: '', label: '전체 카테고리' }, ...categoryOptions(menu)];

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
      await postEvent({ discount, nums, ...(discount > 0 && start && end ? { start, end } : {}) });
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

  return {
    isPending,
    group,
    setGroup,
    query,
    setQuery,
    filter,
    setFilter,
    page,
    setPage,
    groupOptions,
    counts,
    shown,
    curPage,
    pageItems,
    pickable,
    pageChecked,
    checked,
    skipReserve,
    setSkipReserve,
    rate,
    setRate,
    rateError,
    setRateError,
    rateNum,
    rateOk,
    start,
    setStart,
    end,
    setEnd,
    periodBad,
    confirming,
    setConfirming,
    sending,
    error,
    toast,
    setToast,
    selected,
    withDiscount,
    reserveCount,
    select,
    toggle,
    run,
  };
}

export type DiscountEvent = ReturnType<typeof useDiscountEvent>;
