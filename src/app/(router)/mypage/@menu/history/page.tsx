'use client';

import React, { useEffect, useState } from 'react';
import getHistory from '@/api/getHistory';
import { Range, ScrollToTop } from '@/components/atoms';
import { EmptyCard, History } from '@/components/molecules';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchHistoryData(page: number) {
    // if (!email) return;

    await fetch(`/api/protected/getHistory?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.ok === true) {
          setHistory(data.result.historyResult);
          setTotal(data.result.total);
        }
      })
      .catch((err) => {
        console.log('fetch getHistory error:', err);
        return null;
      });
  }

  useEffect(() => {
    fetchHistoryData(currentPage);
  }, []);

  return (
    <>
      <ScrollToTop />
      {history.length === 0 ? (
        <EmptyCard>HISTORY IS EMPTY</EmptyCard>
      ) : (
        <>
          <div
            style={{
              padding: '20px 0 0 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 310px)',
              justifyContent: 'space-between',
              margin: '0 auto',
              gap: '10px',
            }}
          >
            {history.map((val: any) => {
              // console.log(val);
              return <History props={val} key={val.orderId} />;
            })}
          </div>
          <Range style={{ margin: '80px auto 30px auto' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={8}
              onChange={(page) => {
                console.log('onChange page : ', page);
                setCurrentPage(page);
                fetchHistoryData(page);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
            />
          </Range>
        </>
      )}
    </>
  );
}
