'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Range } from '@/shared/ui';
// import Box from '@mui/material/Box';

// import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography, Box as MuiBox, Divider } from '@mui/material';
import {
  chartsTooltipClasses,
  ChartsTooltipContainer,
  ChartsAxisTooltipContent,
} from '@mui/x-charts/ChartsTooltip';

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
  //   const [searchStatic, setSearchStatic] = useState([] as any[]);
  //   const [productStatic, setProductStatic] = useState([]);
  //   const [detail, setDetail] = useState<[]>([]);

  const [tag, setTag] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);

  const [tagData, setTagData] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [tagSeries, setTagSeries] = useState<number[]>([]); // 차트 수치
  const [searchSeries, setSearchSeries] = useState<number[]>([]); // 차트 수치
  const [tagXlabels, setTagXLabels] = useState<string[]>([]);
  const [searchXlabels, setSearchXLabels] = useState<string[]>([]);

  const getStatic = async () => {
    await fetch('/api/getStatistics?type=search', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    } as any)
      .then(async (res) => {
        const data = await res.json();
        console.log(data.result);

        // const { searchResult, productResult } = data.result;
        // setSearchStatic(data.result);
        // setProductStatic(productResult);

        const newTag: React.SetStateAction<any[]> = [];
        const newTagLabels: string[] = [];
        const newTagSeries: number[] = [];
        const newTagRaw: any[] = [];

        const newSearch: React.SetStateAction<any[]> = [];
        const newSearchLabels: string[] = [];
        const newSearchSeries: number[] = [];
        const newSearchRaw: any[] = [];

        data.result.forEach((item: any) => {
          const p = item.params;
          if (p?.tag) {
            // 1. Tag 데이터 처리 (페이지별 클릭 합산)
            newTag.push(p);
            newTagLabels.push(p.tag);
            newTagRaw.push(p.page); // {1: 18, undefined: 12}
            const total = Object.values(p.page || {}).reduce(
              (a: any, b: any) => a + b,
              0,
            );
            newTagSeries.push(total as number);
          } else if (p?.detail) {
            // 2. Search Detail 데이터 처리 (필터 전체 수)
            newSearch.push(p);
            newSearchLabels.push(p.detail);
            newSearchRaw.push(p.filter); // {전체: 55}
            newSearchSeries.push(p.filter?.전체 || 0);
          }
        });

        setTag(newTag);
        setTagXLabels(newTagLabels);
        setTagSeries(newTagSeries);
        setTagData(newTagRaw);

        setSearch(newSearch);
        setSearchXLabels(newSearchLabels);
        setSearchSeries(newSearchSeries);
        setSearchData(newSearchRaw);

        console.log('newTagLabels :', newTagLabels);
        console.log('newTagSeries :', newTagSeries);
        console.log('newTagRaw :', newTagRaw);
        console.log('newSearchLabels :', newSearchLabels);
        console.log('newTagLabels :', newTagLabels);
        console.log('newSearchLabels :', newSearchLabels);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStatic();
  }, []);

  const CustomTooltipContent = (props: any) => {
    console.log('props in tooltip:', props);
    const { axisValue } = props;
    console.log('axisValue in tooltip:', axisValue);
    if (!axisValue) return null;

    const index = searchXlabels.findIndex((label) => label === axisValue);

    if (index === -1) return null;

    const detail = searchData[index];

    return (
      <ChartsTooltipContainer {...props}>
        {/* 기본적으로 값 보여주는 영역 */}
        <ChartsAxisTooltipContent {...props} />

        {/* 우리가 추가하고 싶은 영역 */}
        <Paper sx={{ p: 1, mt: 1, border: '1px solid #ddd' }}>
          <Typography fontWeight='bold' mb={1}>
            {searchXlabels[index]} 상세
          </Typography>

          {Object.entries(detail || {}).map(([key, val]) => (
            <MuiBox
              key={key}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography fontSize={11}>{key}</Typography>
              <Typography fontSize={11} fontWeight={600}>
                {val as number}
              </Typography>
            </MuiBox>
          ))}
        </Paper>
      </ChartsTooltipContainer>
    );
  };

  return (
    <div>
      <div>
        <Box sx={{ width: '100%', height: 400 }}>
          <BarChart
            series={[{ data: tagSeries, color: '#4caf50' }]}
            xAxis={[
              {
                data: tagXlabels,
                height: 28,
                scaleType: 'band',
              },
            ]}
            yAxis={[{ width: 50 }]}
            slotProps={{
              tooltip: {
                placement: 'top',
                trigger: 'item',
              },
            }}
          />
        </Box>
      </div>

      <div>
        <Box sx={{ width: '100%', height: 500, p: 2 }}>
          <Typography variant='h6' sx={{ mb: 3, fontWeight: 'bold' }}>
            🔍 검색어별 필터링 통계
          </Typography>

          <BarChart
            series={[
              {
                data: searchSeries,
                label: '검색 횟수',
                color: '#2196f3',
                // valueFormatter는 숫자 포맷팅만 담당 (에러 방지)
                valueFormatter: (value) => `${value}회`,
              },
            ]}
            xAxis={[
              {
                data: searchXlabels,
                height: 50,
                scaleType: 'band',
                // X축 라벨이 겹칠 경우 회전 각도 조절 가능
                tickLabelStyle: {
                  angle: 30,
                  dominantBaseline: 'hanging',
                  textAnchor: 'start',
                  fontSize: 12,
                  marginRight: 10,
                },
              },
            ]}
            yAxis={[{ width: 50 }]}
            slots={{
              tooltip: CustomTooltipContent,
            }}
          />
        </Box>
      </div>
    </div>
  );
}
