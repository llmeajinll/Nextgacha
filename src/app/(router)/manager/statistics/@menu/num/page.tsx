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
