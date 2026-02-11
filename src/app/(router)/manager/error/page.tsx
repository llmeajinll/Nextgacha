'use client';

import { Range } from '@/components/atoms';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ErrorType = {
  textareaValue: string;
  created_at: string;
  pathname: string;
};

export default function Page() {
  const router = useRouter();
  const [getError, setGetError] = useState<ErrorType[] | null>(null);

  useEffect(() => {
    fetch('/api/getError')
      .then(async (res) => {
        const data = await res.json(); // ✅ 한 번만

        if (!res.ok) {
          throw new Error(data.message || 'Unknown error occurred');
        }

        console.log('Data received:', data);
        setGetError(data.result); // 배열 들어온다고 가정
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <div>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>오류 페이지</h1>
      {getError?.map((val, idx) => (
        <Range key={idx} gap='15' style={{ marginBottom: '10px' }}>
          <div style={{ width: '160px' }}>{val.created_at}</div>
          <div style={{ width: '900px', maxWidth: '900px' }}>
            {val.textareaValue}
          </div>
          <div>{val.pathname}</div>
        </Range>
      ))}
    </div>
  );
}
