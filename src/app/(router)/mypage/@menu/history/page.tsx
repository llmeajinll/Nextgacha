'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import getHistory from '@/entities/order/api/getHistory';
import { ScrollToTop } from '@/shared/ui';
import { History } from '@/entities/order/ui';
import type { OrderView } from '@/entities/order/model/types';
import { EmptyCard } from '@/shared/ui';
import CancelOrderBtn from '@/features/order-cancel/ui/CancelOrderBtn';
import ExchangeRequestBtn from '@/features/order-cancel/ui/ExchangeRequestBtn';
import { Pagination } from '@/shared/ui';
import { grid, paginationWrap } from './page.css';

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const [history, setHistory] = useState<OrderView[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchHistoryData(page: number) {
    // if (!email) return;
    setLoading(true);

    try {
      await fetch(`/api/protected/getHistory?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { tags: ['history'] },
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.ok === true) {
            setHistory(data.result.historyResult);
            setTotal(data.result.total);
          }
        })
        .catch((err) => {
          console.error('fetch getHistory error:', err);
          return null;
        });
    } catch (err) {
      console.error('fetch getHistory error:', err);

      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistoryData(Number(page) || 1);
  }, [page, pathname]);

  if (loading) {
    return <EmptyCard>HISTORY LOADING...</EmptyCard>;
  }

  return (
    <>
      <ScrollToTop />

      {history.length === 0 ? (
        <EmptyCard>HISTORY IS EMPTY</EmptyCard>
      ) : (
        <>
          <div className={grid}>
            {history.map((val) => {
              return (
                <History
                  props={val}
                  key={val.orderId}
                  action={
                    val.status === '상품 확인중' ? (
                      <CancelOrderBtn orderId={val.orderId} onCanceled={() => fetchHistoryData(currentPage)} />
                    ) : (
                      val.status === '배송 완료' && (
                        <ExchangeRequestBtn orderId={val.orderId} onRequested={() => fetchHistoryData(currentPage)} />
                      )
                    )
                  }
                />
              );
            })}
          </div>
          <Pagination
            className={paginationWrap}
            current={currentPage}
            total={total}
            pageSize={8}
            onChange={(page) => {
              setCurrentPage(page);
              fetchHistoryData(page);

              const params = new URLSearchParams(searchParams.toString());
              params.set('page', String(page));

              router.push(`${pathname}?${params.toString()}`);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </>
  );
}
