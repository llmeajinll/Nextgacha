'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Range } from '@/components/atoms';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

export default function page() {
  const router = useRouter();

  const [searchStatic, setSearchStatic] = useState([] as any[]);
  const [productStatic, setProductStatic] = useState([]);

  const [qnaData, setQnaData] = useState<number[]>([]);
  const [infoData, setInfoData] = useState<number[]>([]);
  const [reviewData, setReviewData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<number[]>([]);

  // let uData: number[] = [];
  // let pData: number[] = [];
  // let tData: number[] = [];
  // let xLabels: number[] = [];

  console.log('uData:', qnaData);
  console.log('pData:', infoData);
  console.log('xLabels:', xLabels);
  return (
    <div>
      {/* <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>검색창 SEARCH</h1> */}
      <div>
        {searchStatic.map((value: any, idx) => (
          <div key={value._id}>
            <div
              key={value._id}
              style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}
            >
              <div>
                {/* 1. 검색어 출력 */}
                <strong>상세: {value.params?.detail || '없음'}</strong> | 타입:{' '}
                {value.params?.type || 'N/A'} | 총 조회: {value.count}
                {/* 2. Filter 객체 렌더링 (에러 방지 처 포함) */}
                <div style={{ marginLeft: '10px', color: '#666' }}>
                  [필터 클릭]
                  {value.params?.filter
                    ? Object.entries(value.params.filter).map(
                        ([name, count]) => (
                          <span key={name} style={{ marginRight: '8px' }}>
                            {name}({String(count)})
                          </span>
                        ),
                      )
                    : ' -'}
                </div>
                {/* 3. Page 객체 렌더링 (여기가 에러 지점이었습니다!) */}
                <div style={{ marginLeft: '10px', color: '#0070f3' }}>
                  [페이지 도달]
                  {value.params?.page &&
                  typeof value.params.page === 'object' ? (
                    Object.entries(value.params.page).map(
                      ([pageNum, count]) => (
                        <span key={pageNum} style={{ marginRight: '8px' }}>
                          {pageNum === 'undefined' ? '기본' : pageNum}P(
                          {String(count)})
                        </span>
                      ),
                    )
                  ) : (
                    <span> {String(value.params?.page || '-')}</span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                최근 방문: {value.lastVisit}
              </div>
            </div>
            <div> {value.lastVisit}</div>
          </div>
        ))}
      </div>

      {/* {
    _id: new ObjectId('697b9ebe9d7ce1c6f364cd50'),
    page: 'search',
    params: { detail: '진격의 거인', filter: [Object], page: [Object], tag: null },
    lastVisit: '2026-02-01 05:35:15'
  }, */}

      <h1>NUM</h1>
      {/* <div>
        {productStatic.map((value: any, idx) => (
          <div key={value._id}>
            <div>
              {value.page} {value.lastVisit}
            </div>
            <div>info : {value.tab?.info || 0}</div>
            <div>qna : {value.tab?.qna || 0}</div>
            <div>review : {value.tab?.review || 0}</div>
            <div>
              total :{' '}
              {(value.tab?.info || 0) +
                (value.tab?.qna || 0) +
                (value.tab?.review || 0)}
            </div>
          </div>
        ))}
      </div> */}

      {/* {
    _id: new ObjectId('697e53fd0f61c9d62c66e988'),
    page: 17,
    created_at: '2026-02-01 04:11:57',
    lastVisit: '2026-02-01 04:12:21',
    tab: { info: 2, qna: 1 }
  }, */}
    </div>
  );
}
