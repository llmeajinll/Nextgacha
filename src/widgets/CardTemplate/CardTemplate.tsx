'use client';

import React, { useState } from 'react';
import { Card } from '@/entities/product/ui';
import {
  cardTemplateContainer,
  noProductContainer,
  pageWrap,
} from './cardtemplate.css';
import { Title, Range, ScrollToTop } from '@/shared/ui';
import { useAtom } from 'jotai';
import { searchProductsAtom } from '@/entities/product/model/store';

import { CardProps } from '@/entities/product/model/types';

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
    <div className={pageWrap}>
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
