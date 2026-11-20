'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react';
import { CardProps } from '@/entities/product/model/types';
import { SearchResults } from '@/widgets';
import { Title, ScrollToTop } from '@/shared/ui';
import { getStandardCategory } from '@/entities/product/lib/getStandardCategory';
import { tagCategory } from '@/entities/product/lib/category';
import { Pagination } from '@/shared/ui';
import { useAtom } from 'jotai';
import { searchProductsAtom } from '@/entities/product/model/store';
import getProducts from '@/entities/product/api/getProducts';
import { paginationWrap } from './searchPage.css';

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // let TAG = undefined;

  const search = searchParams.get('search');
  const targetCategory = getStandardCategory(search);

  const type = searchParams.get('type');
  const company = searchParams.get('company');
  const detail = searchParams.get('detail');
  const tag = searchParams.get('tag');
  const page = searchParams.get('page');
  const filter = searchParams.get('filter');

  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [total, setTotal] = useState(0);

  const [searchProducts, setSearchProducts] = useAtom(searchProductsAtom);

  type TagKey = keyof typeof tagCategory;
  const TAG = !tag ? undefined : tagCategory[(tag as TagKey) || '전체'];

  const handleSearch = async (page: number) => {
    const result = await getProducts({
      tag: TAG,
      search: search || detail ? (detail ? detail : targetCategory) : undefined,
      filter: filter && filter !== '전체' ? filter : undefined,
      page,
      count: 20,
    });
    setSearchProducts(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    handleSearch(currentPage);
  }, [tag, search, detail, filter, page, tag]);

  return (
    <>
      {/* <div>SearchPage</div>
      <div>{type}</div>
      <div>{detail}</div>
      <div>{company}</div> */}
      <Suspense>
        <SearchResults />

        {searchProducts.length !== 0 && (
          <Pagination
            className={paginationWrap}
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
        )}
      </Suspense>
    </>
  );
}
