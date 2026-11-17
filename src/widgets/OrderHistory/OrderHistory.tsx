'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { EmptyCard, Pagination, ScrollToTop } from '@/shared/ui';
import { History } from '@/entities/order/ui';
import type { OrderView } from '@/entities/order/model/types';
import getHistory from '@/entities/order/api/getHistory';
import CancelOrderBtn from '@/features/order-cancel/ui/CancelOrderBtn';
import ExchangeRequestBtn from '@/features/order-cancel/ui/ExchangeRequestBtn';
import { grid, paginationWrap } from './orderHistory.css';

export default function OrderHistory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const [history, setHistory] = useState<OrderView[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchHistoryData(page: number) {
    setLoading(true);
    const result = await getHistory(page);
    if (result) {
      setHistory(result.historyResult);
      setTotal(result.total);
    }
    setLoading(false);
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
