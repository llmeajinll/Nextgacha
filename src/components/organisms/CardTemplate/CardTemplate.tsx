'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer } from './cardtemplate.css';
import { Title } from '@/components/atoms';
import { CardProps } from '@/shared/type';

export default function CardTemplate() {
  const [products, setProducts] = useState([]);
  const handleSearch = async () => {
    const res = await fetch(`/api/getProduct`);
    const data = await res.json();
    console.log(data);
    setProducts(data);
  };

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <div style={{ width: '1272px' }}>
      <div className={cardTemplateContainer}>
        {/* <Card id='reserve1' />
        <Card id='reserve2' />
        <Card id='reserve3' />
        <Card id='reserve4' />
        <Card id='reserve5' />
        <Card id='reserve6' />
        <Card id='reserve7' />
        <Card id='reserve8' /> */}
        {products.map((item: CardProps) => (
          <Card props={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
