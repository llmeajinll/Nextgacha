'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import getHistory from '@/api/getHistory';
import { History } from '@/components/molecules';

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!email) return;

      const history = await getHistory(email).then((res) => {
        return res;
      });
      const result = await history?.json();
      setData(result?.result || []);
    }
    fetchData();
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
        {data.map((val: any, idx) => (
          <History props={val} key={idx} />
        ))}
      </div>
    </>
  );
}
