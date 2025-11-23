'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { Ticket } from '@/components/molecules';
import useTicket from '@/app/hooks/useTicket';
import { cartContainer, ticketContainer } from './cart.css';
import Link from 'next/link';

export default function Cart({ props }: { props?: any }) {
  const { productInfo, cartProducts } = props || {};
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log(props);

  const { increase, decrease, erase } = useTicket();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <Range className={cartContainer}>
      <Image
        src={productInfo?.image[0] || '/images/defaultImg.png'}
        width={130}
        height={130}
        alt='productImg'
      />

      <Range preset='columnBetween'>
        <Range
          preset='left'
          gap='none'
          className={ticketContainer}
          ref={scrollRef}
        >
          {cartProducts.map((item: any, idx: number) => {
            const limit = productInfo.list.find(
              (val: { name: string; count: number }) => val.name === item.name
            );
            console.log(limit.count);
            const props = {
              count: item.count,
              title: productInfo.title,
              name: item.name,
              price: productInfo.price,
              code: item.name + productInfo.num,
              num: productInfo.num,
              limit: limit,
            };
            return (
              <Ticket
                key={idx}
                props={props}
                increase={increase}
                decrease={decrease}
                erase={erase}
              />
            );
          })}
        </Range>
      </Range>
    </Range>
  );
}
