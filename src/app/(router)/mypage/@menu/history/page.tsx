'use client';

import React, { useEffect, useState } from 'react';
import getHistory from '@/api/getHistory';
import { History } from '@/components/molecules';

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchHistoryData() {
      // if (!email) return;

      await getHistory().then(async (res) => {
        const data = await res?.json();
        // console.log('history : ', data);
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
      <div
        style={{
          padding: '20px 0 0 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 620px)',
          justifyContent: 'space-between',
          margin: '0 auto',
        }}
      >
        {data.map((val: any, idx) => {
          // console.log(val);
          return <History props={val} key={idx} />;
        })}
      </div>
    </>
  );
}
