'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WarningDiamond } from 'pixelarticons/react';
import { CountTab, Pagination } from '@/shared/ui';
import ErrorCard from '@/features/error-manage/ui/ErrorCard';
import {
  ERROR_PAGE_SIZE,
  ERROR_STATUSES,
  ERROR_TYPES,
  type AdminError,
  type ErrorStatus,
  type ErrorTypeFilter,
} from '@/features/error-manage/model/types';
import * as s from './errorTemplate.css';

export default function ErrorTemplate({
  status,
  type,
  errors,
  total,
  page,
  counts,
  paymentOpen,
}: {
  status: ErrorStatus;
  type: ErrorTypeFilter;
  errors: AdminError[];
  total: number;
  page: number;
  counts: Record<ErrorStatus, number>;
  paymentOpen: number;
}) {
  const router = useRouter();
  const [toast, setToast] = useState('');
  const slug = ERROR_STATUSES.find((x) => x.status === status)!.slug;
  const href = (next: { status?: string; type?: string; page?: number }) => {
    const q = new URLSearchParams({ status: next.status ?? slug, type: next.type ?? type });
    if (next.page && next.page > 1) q.set('page', String(next.page));
    return `/manager/error?${q}`;
  };

  return (
    <div className={s.container}>
      {paymentOpen > 0 && (
        <div role='status' className={s.alert}>
          <WarningDiamond aria-hidden className={s.alertIcon} />
          <p className={s.alertText}>
            <b>결제 관련 기록 {paymentOpen}건</b>이 처리를 기다려요. Toss 대시보드의 결제 내역과 주문을 비교해서 처리해 주세요.
          </p>
          <Link href={href({ status: 'open', type: 'system' })} className={s.alertLink}>
            시스템 기록 보기
          </Link>
        </div>
      )}

      <div className={s.toolbar}>
        <nav aria-label='처리 상태' className={s.tabs}>
          {ERROR_STATUSES.map((t) => (
            <CountTab
              key={t.slug}
              href={href({ status: t.slug })}
              label={t.status}
              count={counts[t.status]}
              active={t.status === status}
            />
          ))}
        </nav>
        <nav aria-label='종류' className={s.filter}>
          {ERROR_TYPES.map((t) => (
            <Link
              key={t.type}
              href={href({ type: t.type })}
              aria-current={t.type === type ? 'page' : undefined}
              className={t.type === type ? `${s.filterItem} ${s.filterOn}` : s.filterItem}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      {toast && (
        <div role='status' className={s.toast}>
          {toast}
        </div>
      )}

      <section aria-label={`${status} 기록`} className={s.list}>
        {errors.map((e) => (
          <ErrorCard
            key={e._id}
            error={e}
            onDone={(message) => {
              setToast(message);
              router.refresh();
            }}
          />
        ))}
        {errors.length === 0 && (
          <div className={s.empty}>
            <span className={s.emptyPixel}>ALL CLEAR</span>
            <span className={s.emptyTitle}>{status} 상태인 기록이 없어요.</span>
            <span className={s.muted}>새 제보나 에러가 들어오면 여기에 보여요.</span>
          </div>
        )}
      </section>

      <Pagination current={page} total={total} pageSize={ERROR_PAGE_SIZE} onChange={(p) => router.push(href({ page: p }))} />
    </div>
  );
}
