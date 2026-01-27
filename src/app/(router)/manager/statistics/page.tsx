'use client';

import React, { useState, useEffect } from 'react';
import { Range } from '@/components/atoms';

export default function page() {
  const [searchStatic, setSearchStatic] = useState([] as any[]);
  const [productStatic, setProductStatic] = useState([]);

  const getStatic = async () => {
    await fetch('/api/getStatistics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    } as any)
      .then(async (res) => {
        const data = await res.json();
        console.log(data);

        const { searchResult, productResult } = data.result;
        setSearchStatic(searchResult);
        setProductStatic(productResult);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStatic();
  }, []);
  return (
    <div>
      <h1>검색창 SEARCH</h1>
      <div>
        {searchStatic.map((value: any, idx) => (
          <div key={value._id}>
            <div>
              detail : {value.params.detail} || {value.params.filter} ||{' '}
              {value.count}
            </div>
            <div> {value.timestamp}</div>
          </div>
        ))}
      </div>

      <h1>NUM</h1>
      <div>
        {productStatic.map((value: any, idx) => (
          <div key={value._id}>
            <div>
              {value.page} {value.timestamp}
            </div>
            <div>info : {value.tab?.info}</div>
            <div>qna : {value.tab?.qna}</div>
            <div>review : {value.tab?.review}</div>
            <div>
              total : {value.tab?.info + value.tab?.qna + value.tab?.review}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
