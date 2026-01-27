'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer, noProductContainer } from './cardTemplate.css';
import { Title, Range, ScrollToTop } from '@/components/atoms';
import { useAtom } from 'jotai';
import { searchProductsAtom } from '@/jotai/store';

import { CardProps } from '@/shared/type';

export default function CardTemplate({
  tag,
  search,
  count,
  props,
}: {
  tag?: string;
  search?: string;
  count?: number;
  props?: CardProps[];
}) {
  const [products, setProducts] = useState([] as CardProps[]);
  const [searchProducts, setSearchProducts] = useAtom(searchProductsAtom);

  console.log('serachProducts : ', searchProducts);

  console.log(
    'CardTemplate tag:',
    tag,
    'search:',
    search,
    'count:',
    count,
    'props:',
    props,
  );

  return (
    <div style={{ width: '1272px', margin: '0 auto' }}>
      <ScrollToTop />
      {searchProducts && searchProducts.length === 0 ? (
        <Range width='full' className={noProductContainer}>
          NO RESULT :{'('}
        </Range>
      ) : (
        <div className={cardTemplateContainer}>
          {searchProducts.map((item: CardProps) => (
            <Card props={item} key={item._id} />
          ))}
        </div>
      )}
    </div>
  );
}
