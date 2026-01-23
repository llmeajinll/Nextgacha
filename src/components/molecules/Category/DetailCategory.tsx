'use client';

import React, { useState, useMemo } from 'react';
import { detailFilter } from '@/shared/category';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Range } from '@/components/atoms';
import {
  filterContainer,
  filterStyle,
  selectStyle,
  normalStyle,
} from './detailCategory.css';

export default function DetailCategory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const detailParams = searchParams.get('detail') || ' ';
  const filterParams = searchParams.get('filter') || ' ';
  // console.log('search page search:', search);
  //   const targetCategory = getStandardCategory(search);
  //   console.log(`${search} 로 검색하여 ${targetCategory} 결과를 찾습니다.`);
  type DetailKey = keyof typeof detailFilter;
  //   const filterParams = searchParams.get('filter');
  console.log('detailParams : ', detailParams);

  const detail = useMemo(() => {
    return detailFilter[(detailParams as DetailKey) || ''];
  }, [detailParams]);

  return (
    <Range gap='10' className={filterContainer}>
      {detail &&
        detail.map((val, idx) => (
          <div
            key={idx}
            className={`${filterStyle} ${val === filterParams ? selectStyle : normalStyle}`}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('filter', val);
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            {val}
          </div>
        ))}
    </Range>
  );
}
