'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import getProducts from '@/api/getProducts';
import { CardProps } from '@/shared/type';
import { Range } from '@/components/atoms';
import { ProductManageCard } from '@/components/molecules';
import { getStandardCategory } from '@/shared/getStandardCategory';

function page() {
  const router = useRouter();
  const [products, setProducts] = useState([] as CardProps[]);
  const [searchInput, setSearchInput] = useState('');
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('search');

  useEffect(() => {
    let query = {};

    if (!search) {
      query = { tag: 'all', count: 100 };
    } else {
      const standardCategory = getStandardCategory(searchInput);
      query = { search: standardCategory, count: 100 };
    }

    getProducts(query).then((data: any) => {
      setProducts(data.data);
    });
  }, [search, page]);

  return (
    <div>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>상품 관리</h1>
      <input
        placeholder='제품 검색'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{
          width: '500px',
          border: '1px solid lightgray',
          padding: '8px 5px 7px 5px',
          fontSize: '18px',
          color: '#4c4c4c',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            console.log('searchInput : ', searchInput);

            router.push(`/manager/product_manage?search=${search}&page=1`, {
              scroll: false,
            });
          }
        }}
      />
      <Range
        preset='between'
        gap='15'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 640px)',
          marginTop: '30px',
        }}
      >
        {products &&
          products.map((product: CardProps) => (
            <ProductManageCard key={product._id} {...product} />
          ))}
      </Range>
    </div>
  );
}

export default page;
