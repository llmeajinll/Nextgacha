'use client';

import React, { useState, useEffect } from 'react';
import { Banner } from '../organisms';
import { CardTemplate } from '../templates';
import { cardTemplateContainer } from '../templates/CardTemplate/cardtemplate.css';
import getProducts from '@/api/getProudcts';
import { Btn, Title, Range } from '../atoms';
import { CardProps } from '@/shared/type';
import { Card } from '../molecules';

export default function HomePage() {
  const [hotProduct, setHotProduct] = useState([] as CardProps[]);
  const [newProduct, setNewProduct] = useState([] as CardProps[]);
  const [reserveProduct, setReserveProduct] = useState([] as CardProps[]);

  const fetchProducts = async () => {
    const hotResult = await getProducts({ tag: 'hot', count: 8 });
    console.log('hotResult : ', hotResult);
    setHotProduct(hotResult.data);
    const newResult = await getProducts({ tag: 'new', count: 8 });
    console.log('newResult : ', newResult);
    setNewProduct(newResult.data);
    const reserveResult = await getProducts({ tag: 'reserve', count: 8 });
    console.log('reserveResult : ', reserveResult);
    setReserveProduct(reserveResult.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Banner />

      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='인기 상품' />
        <Range className={cardTemplateContainer}>
          {hotProduct.map((val, idx) => (
            <Card props={val} key={idx} />
          ))}
        </Range>
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', tag: '인기 상품' }}
        />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='신규 상품' />
        <Range className={cardTemplateContainer}>
          {newProduct.map((val, idx) => (
            <Card props={val} key={idx} />
          ))}
        </Range>
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', tag: '신규 상품' }}
        />
      </div>

      <div
        style={{
          width: '1272px',
          padding: '0 20px',
          marginBottom: '10px',
        }}
      >
        <Title text='예약 판매' />
        <Range className={cardTemplateContainer}>
          {reserveProduct.map((val, idx) => (
            <Card props={val} key={idx} />
          ))}
        </Range>
        <Btn
          type='more'
          href='search'
          query={{ type: 'main', tag: '예약 판매' }}
        />
      </div>
    </>
  );
}
