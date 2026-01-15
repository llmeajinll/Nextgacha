'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { CardTemplate } from '../templates';
import { getStandardCategory } from '@/shared/getStandardCategory';

export default function SearchPage() {
  const searchParams = useSearchParams();
  let tag = undefined;

  const search = searchParams.get('search');
  // console.log('search page search:', search);
  const targetCategory = getStandardCategory(search);
  console.log(`${search} 로 검색하여 ${targetCategory} 결과를 찾습니다.`);

  const type = searchParams.get('type');
  const company = searchParams.get('company');
  const detail = searchParams.get('detail');

  // console.log(detail);

  if (detail === '전체 상품') {
    tag = 'all';
  } else if (detail === '인기 상품') {
    tag = 'hot';
  } else if (detail === '신규 상품') {
    tag = 'new';
  } else if (detail === '예약 판매') {
    tag = 'reserve';
  }

  return (
    <>
      {/* <div>SearchPage</div>
      <div>{type}</div>
      <div>{detail}</div>
      <div>{company}</div> */}
      <CardTemplate
        search={targetCategory || detail || ''}
        tag={tag}
        count={20}
      />
    </>
  );
}
