'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getProducts from '@/api/getProducts';
import { CardProps } from '@/shared/type';
import { Range } from '@/components/atoms';
import { ProductManageCard } from '@/components/molecules';

function page() {
  const router = useRouter();
  const [products, setProducts] = useState([] as CardProps[]);
  useEffect(() => {
    getProducts({ tag: 'all', count: 100 }).then((data: any) => {
      setProducts(data.data);
    });
  }, []);
  return (
    <div>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>상품 관리</h1>
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
