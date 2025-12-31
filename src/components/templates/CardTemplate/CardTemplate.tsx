'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer } from './cardtemplate.css';
import { Title } from '@/components/atoms';
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

  const handleSearch = async () => {
    let url = '';
    if (tag) {
      url = `/api/getProduct?tag=${tag}&count=${count || 8}`;
    } else if (search) {
      url = `/api/getProduct?search=${search}&count=20`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    // console.log(data);
    setProducts(data);
  };

  useEffect(() => {
    if (props && props.length > 0) {
      setProducts(props);
      return;
    } else {
      handleSearch();
    }
  }, [tag, search, count, props]);

  return (
    <div style={{ width: '1272px', margin: '0 auto' }}>
      <div className={cardTemplateContainer}>
        {products.map((item: CardProps) => (
          <Card props={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
