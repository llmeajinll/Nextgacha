'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react';
import { CardProps } from '@/shared/type';
import { CardTemplate } from '../templates';
import { Title, Range, ScrollToTop } from '@/components/atoms';
import { getStandardCategory } from '@/shared/getStandardCategory';
import { tagCategory } from '@/shared/category';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { useAtom } from 'jotai';
import { searchProductsAtom } from '@/jotai/store';
import getProducts from '@/api/getProudcts';

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // let TAG = undefined;

  const search = searchParams.get('search');
  // console.log('search page search:', search);
  const targetCategory = getStandardCategory(search);

  console.log(`${search} 로 검색하여 ${targetCategory} 결과를 찾습니다.`);

  const type = searchParams.get('type');
  const company = searchParams.get('company');
  const detail = searchParams.get('detail');
  const tag = searchParams.get('tag');
  const page = searchParams.get('page');
  const filter = searchParams.get('filter');

  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [total, setTotal] = useState(0);

  const [searchProducts, setSearchProducts] = useAtom(searchProductsAtom);

  // console.log(detail);
  type TagKey = keyof typeof tagCategory;
  const TAG = !tag ? undefined : tagCategory[(tag as TagKey) || '전체'];

  console.log('TAG : ', TAG);

  const handleSearch = async (page: number) => {
    const params = new URLSearchParams();
    if (TAG) params.set('tag', TAG);
    if (search || detail)
      params.set('search', detail ? detail : targetCategory);
    if (filter) params.set('filter', filter === '전체' ? '' : filter);
    if (page) params.set('page', page.toString());
    let url = '';

    url = `/api/getProduct?${params.toString()}&count=20`;

    console.log('url : ', url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    setSearchProducts(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    handleSearch(currentPage);
  }, [tag, search, detail, filter, page]);

  return (
    <>
      {/* <div>SearchPage</div>
      <div>{type}</div>
      <div>{detail}</div>
      <div>{company}</div> */}
      <Suspense>
        <CardTemplate />

        {searchProducts.length !== 0 && (
          <Range style={{ margin: '40px auto' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={20}
              onChange={(page) => {
                setCurrentPage(page);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(page));

                router.push(`${pathname}?${params.toString()}`);
              }}
            />
          </Range>
        )}
      </Suspense>
    </>
  );
}
