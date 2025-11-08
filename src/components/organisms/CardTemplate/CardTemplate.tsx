'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer } from './cardtemplate.css';
import { Title } from '@/components/atoms';
import { CardProps } from '@/shared/type';

export default function CardTemplate({
  tag,
  search,
}: {
  tag?: string;
  search?: string;
}) {
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    let url = '';
    if (tag) {
      url = `/api/getProduct?tag=${tag}&count=8`;
    }

    if (search) {
      url = `/api/getProduct?search=${search}&count=20`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);
    setProducts(data);
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
