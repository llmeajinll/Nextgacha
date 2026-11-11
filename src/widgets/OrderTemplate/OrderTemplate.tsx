'use client';

import React, { useState } from 'react';
import Form from 'next/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CountTab, Pagination } from '@/shared/ui';
import { ChevronRight, Search } from 'pixelarticons/react';
import Order, { type Ship } from '@/features/order-manage/ui/Order';
import { toArrive, toSending } from '@/features/order-manage/api/orderActions';
import {
  ORDER_PAGE_SIZE,
  ORDER_STATUSES,
  type AdminOrder,
  type OrderStatus,
} from '@/features/order-manage/model/status';
import * as s from './orderTemplate.css';

export default function OrderTemplate({
  status,
  orders,
  total,
  page,
  counts,
  q,
}: {
  status: OrderStatus;
  orders: AdminOrder[];
  total: number;
  page: number;
  counts: Record<OrderStatus, number>;
  // 주문번호 검색어. 있으면 모든 상태에서 찾은 결과이고 일괄 처리는 안 함
  q: string;
}) {
  const router = useRouter();
  const slug = ORDER_STATUSES.find((x) => x.status === status)!.slug;
  // 일괄 처리는 상품 확인중 → 배송중, 배송중 → 배송 완료만
  const next: OrderStatus | null = q ? null : status === '상품 확인중' ? '배송중' : status === '배송중' ? '배송 완료' : null;
  const toNext = next === '배송중' ? '배송중으로' : '배송 완료로';

  const [ships, setShips] = useState<Record<string, Ship>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  const shipOf = (o: AdminOrder) => ships[o.orderId] ?? { courier: o.courier, invoice: o.invoice };
  // 새로고침으로 목록이 바뀌어도 화면에 있는 주문만 선택으로 침
  const selected = orders.filter((o) => checked.has(o.orderId));
  const allChecked = orders.length > 0 && selected.length === orders.length;

  const done = (message: string) => {
    setToast(message);
    setChecked(new Set());
    setConfirming(false);
    setBulkError('');
    router.refresh();
  };

  const runBulk = async () => {
    setSending(true);
    try {
      if (status === '상품 확인중') {
        await toSending(selected.map((o) => ({ orderId: o.orderId, ...shipOf(o), invoice: shipOf(o).invoice.trim() })));
      } else {
        await toArrive(selected.map((o) => o.orderId));
      }
      done(`${selected.length}건을 ${toNext} 바꿨어요.`);
    } catch (e) {
      setBulkError(e instanceof Error ? e.message : '반영하지 못했어요.');
      setConfirming(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.searchRow}>
        <Form action={`/manager/order/${slug}`} className={s.search}>
          <Search aria-hidden />
          <input
            key={q}
            type='search'
            name='q'
            inputMode='numeric'
            defaultValue={q}
            aria-label='주문번호 검색'
            placeholder='주문번호로 검색'
            className={s.searchInput}
          />
        </Form>
        {q && (
          <Link href={`/manager/order/${slug}`} className={s.ghostBtn}>
            검색 지우기
          </Link>
        )}
      </div>

      <nav aria-label='주문 상태' className={s.tabs}>
        {ORDER_STATUSES.map((t, i) => (
          <React.Fragment key={t.slug}>
            {t.status === '환불' && <span aria-hidden className={s.tabGap} />}
            <CountTab
              href={`/manager/order/${t.slug}`}
              label={t.status}
              count={counts[t.status]}
              active={!q && t.status === status}
            />
            {i < 2 && <ChevronRight aria-hidden className={s.tabArrow} />}
          </React.Fragment>
        ))}
      </nav>

      {toast && (
        <div role='status' className={s.toast}>
          {toast}
        </div>
      )}

      {q && (
        <p role='status' className={s.muted}>
          “{q}” 검색 결과 {total}건 · 모든 상태에서 찾았어요
        </p>
      )}

      {next && orders.length > 0 && (
        <div className={s.bulk}>
          <div className={s.bulkRow}>
            <label className={s.selectAll}>
              <input
                type='checkbox'
                checked={allChecked}
                onChange={() => {
                  setChecked(new Set(allChecked ? [] : orders.map((o) => o.orderId)));
                  setConfirming(false);
                  setBulkError('');
                }}
                className={s.checkInput}
              />
              전체 선택
              {selected.length > 0 && <span className={s.muted}>{selected.length}건 선택됨</span>}
            </label>
            <button
              type='button'
              disabled={selected.length === 0}
              className={s.bulkBtn}
              onClick={() => {
                const missing =
                  status === '상품 확인중' ? selected.filter((o) => !shipOf(o).courier || !shipOf(o).invoice.trim()).length : 0;
                if (missing) {
                  setBulkError(
                    `송장을 입력하지 않은 주문이 ${missing}건 있어요. 택배사와 송장번호를 입력하거나 선택을 빼 주세요.`,
                  );
                  return;
                }
                setBulkError('');
                setConfirming(true);
              }}
            >
              선택 {selected.length}건 {toNext}
            </button>
          </div>
          {bulkError && (
            <p role='status' className={s.bulkError}>
              {bulkError}
            </p>
          )}
          {confirming && (
            <div className={s.confirm}>
              <span>
                선택한 {selected.length}건을 {toNext} 바꿀까요?
              </span>
              <div className={s.confirmBtns}>
                <button type='button' className={s.ghostBtn} onClick={() => setConfirming(false)}>
                  취소
                </button>
                <button type='button' className={s.primaryBtn} disabled={sending} onClick={runBulk}>
                  {sending ? '바꾸는 중…' : '바꾸기'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <section aria-label={q ? '검색된 주문' : `${status} 주문`} className={s.list}>
        {orders.map((o) => (
          <Order
            key={o.orderId}
            order={o}
            checked={next ? checked.has(o.orderId) : undefined}
            onCheck={
              next
                ? () => {
                    const n = new Set(checked);
                    if (n.has(o.orderId)) n.delete(o.orderId);
                    else n.add(o.orderId);
                    setChecked(n);
                    setConfirming(false);
                    setBulkError('');
                  }
                : undefined
            }
            ship={shipOf(o)}
            onShip={(ship) => setShips({ ...ships, [o.orderId]: ship })}
            onDone={done}
          />
        ))}
        {orders.length === 0 && (
          <div className={s.empty}>
            <span className={s.emptyTitle}>{q ? `“${q}”에 맞는 주문이 없어요.` : `${status} 주문이 없어요.`}</span>
            <span className={s.muted}>{q ? '주문번호를 다시 확인해 주세요.' : '새 주문이 들어오면 여기에 보여요.'}</span>
          </div>
        )}
      </section>

      <Pagination
        current={page}
        total={total}
        pageSize={ORDER_PAGE_SIZE}
        onChange={(p) => router.push(`/manager/order/${slug}?${new URLSearchParams({ page: String(p), ...(q && { q }) })}`)}
      />
    </div>
  );
}
