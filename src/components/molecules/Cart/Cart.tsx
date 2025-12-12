'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { Ticket } from '@/components/molecules';
import useCart from '@/app/hooks/useCart';
import { cartContainer, ticketContainer } from './cart.css';
import Link from 'next/link';

export default function Cart({ props }: { props?: any }) {
  const { productInfo, cartProducts } = props || {};
  const scrollRef = useRef<HTMLDivElement>(null);
  // console.log(props);

  const { increase, decrease, erase } = useCart();

  // const increase = () => {};
  // const decrease = () => {};
  // const erase = () => {};

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
        src={props?.image[0] || '/images/defaultImg.png'}
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
          {props.product.map((item: any, idx: number) => {
            const limit = props.list.find(
              (val: { name: string; count: number }) => val.name === item.name
            );
            const data = {
              count: item.count,
              title: props.title,
              price: props.price,
              code: item.name + props.num,
              num: props.num,
              name: item.name,
              limit: limit,
            };

            // console.log('ticket props in cart: ', props);
            return (
              <Ticket
                key={idx}
                props={data}
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
