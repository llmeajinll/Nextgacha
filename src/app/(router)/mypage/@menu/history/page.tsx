'use client';

import React, { useEffect, useState } from 'react';
import getHistory from '@/api/getHistory';
import { EmptyCard, History } from '@/components/molecules';

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchHistoryData() {
      // if (!email) return;

      await getHistory().then(async (res) => {
        const data = await res?.json();
        console.log('history : ', data);
        setData(data.result);
        // return data;
      });
      // const result = await history?.json();
      // setData(result?.result || []);
    }
    fetchHistoryData();
  }, []);

  return (
    <>
      {data.length === 0 ? (
        <EmptyCard>HISTORY IS EMPTY</EmptyCard>
      ) : (
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
          {data.map((val: any) => {
            // console.log(val);
            return <History props={val} key={val.orderId} />;
          })}
        </div>
      )}
    </>
  );
}
