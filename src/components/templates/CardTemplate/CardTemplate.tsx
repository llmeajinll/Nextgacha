'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer } from './cardtemplate.css';
import { Title, Range, ScrollToTop } from '@/components/atoms';

import { CardProps } from '@/shared/type';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // console.log(
  //   'CardTemplate tag:',
  //   tag,
  //   'search:',
  //   search,
  //   'count:',
  //   count,
  //   'props:',
  //   props
  // );

  const handleSearch = async (page: number) => {
    let url = '';
    if (tag) {
      url = `/api/getProduct?tag=${tag}&count=${count || 8}&page=${page}`;
    } else if (search) {
      url = `/api/getProduct?search=${search}&count=20&page=${page}`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    console.log(result.data);
    setProducts(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    if (props && props.length > 0) {
      setProducts(props);
      return;
    } else {
      handleSearch(currentPage);
    }
  }, [tag, search, count, props, currentPage]);

  return (
    <div style={{ width: '1272px', margin: '0 auto' }}>
      <ScrollToTop />
      <div className={cardTemplateContainer}>
        {products.map((item: CardProps) => (
          <Card props={item} key={item._id} />
        ))}
      </div>
      {count && (
        <Range style={{ margin: '40px auto' }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={20}
            onChange={(page) => {
              console.log('onChange page : ', page);
              setCurrentPage(page);
              handleSearch(page);
            }}
          />
        </Range>
      )}
    </div>
  );
}
