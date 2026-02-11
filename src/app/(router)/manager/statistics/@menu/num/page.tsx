'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const BarChart = dynamic(
  () => import('@mui/x-charts/BarChart').then((mod) => mod.BarChart),
  { ssr: false },
);

const Box = dynamic(
  () => import('@mui/material/Box').then((mod) => mod.default),
  {
    ssr: false,
  },
);

export default function page() {
  const [productStatic, setProductStatic] = useState([]);

  const [qnaData, setQnaData] = useState<number[]>([]);
  const [infoData, setInfoData] = useState<number[]>([]);
  const [reviewData, setReviewData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<number[]>([]);

  const getStatic = async () => {
    await fetch('/api/getStatistics?type=num', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    } as any)
      .then(async (res) => {
        const data = await res.json();
        console.log(data.result);

        // const { searchResult, productResult } = data.result;
        setProductStatic(data.result);
        // setProductStatic(productResult);

        const newXLabels: number[] = [];
        const newInfoData: number[] = [];
        const newQnaData: number[] = [];
        const newReviewData: number[] = [];

        data.result.forEach((item: any) => {
          newXLabels.push(item.page);
          newInfoData.push(item.tab?.info ?? 0);
          newQnaData.push(item.tab?.qna ?? 0);
          newReviewData.push(item.tab?.review ?? 0);
        });

        setXLabels(newXLabels);
        setInfoData(newInfoData);
        setQnaData(newQnaData);
        setReviewData(newReviewData);

        // 새 배열을 로그로 출력
        console.log('uData:', newQnaData);
        console.log('pData:', newInfoData);
        console.log('tData:', newReviewData);
        console.log('xLabels:', newXLabels);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStatic();
  }, []);

  const CustomTooltipContent = (props: any) => {
    const { itemData, series } = props;

    // 현재 마우스가 올라간 바의 인덱스
    const index = itemData.dataIndex;

    // 현재 인덱스의 모든 데이터 합계 계산
    // infoData, qnaData, reviewData는 차트 외부 스코프에 있는 변수라고 가정합니다.
    const total = infoData[index] + qnaData[index] + reviewData[index];

    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          {xLabels[index]} {/* X축 라벨 표시 */}
        </div>

        {/* 각 시리즈별 데이터 표시 (MUI 기본 스타일 흉내) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <span>
              <span style={{ color: '#02b2af' }}>●</span> info:
            </span>
            <strong>{infoData[index]}</strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <span>
              <span style={{ color: '#2e96ff' }}>●</span> qna:
            </span>
            <strong>{qnaData[index]}</strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <span>
              <span style={{ color: '#b800d8' }}>●</span> review:
            </span>
            <strong>{reviewData[index]}</strong>
          </div>
        </div>

        <hr
          style={{ margin: '8px 0', border: '0', borderTop: '1px solid #eee' }}
        />

        {/* 합계(Total) 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          <span>Total:</span>
          <span>{total}</span>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Box sx={{ width: '100%', height: 300 }}>
        <BarChart
          series={[
            { data: infoData, label: 'info', id: 'infoId', stack: 'total' },
            { data: qnaData, label: 'qna', id: 'qnaId', stack: 'total' },
            {
              data: reviewData,
              label: 'review',
              id: 'reviewId',
              stack: 'total',
            },
          ]}
          xAxis={[{ data: xLabels, height: 28 }]}
          yAxis={[{ width: 50 }]}
          // 커스텀 툴팁 주입
          // slots={{
          //   tooltip: CustomTooltipContent,
          // }}
          // // axis 기준으로 툴팁이 뜨게 하면 더 보기 편합니다 (선택사항)
          // slotProps={{
          //   tooltip: { trigger: 'axis' },
          // }}
        />
      </Box>
    </div>
  );
}
