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
      {data.length === 0 ? (
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: '130px',
            padding: '20px',
            border: '1px solid lightgray',
            fontFamily: 'silkscreen',
            color: 'gray',
            fontSize: '30px',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: '24px',
            marginTop: '15px',
          }}
        >
          HISTORY IS EMPTY
        </div>
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
