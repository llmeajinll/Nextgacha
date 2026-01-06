'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { Ticket } from '@/components/molecules';
import useCart from '@/app/hooks/useCart';
import { cartContainer, ticketContainer } from './cart.css';
import Link from 'next/link';

export default function Cart({
  props,
  onUpdate,
}: {
  props?: any;
  onUpdate?: (num: number, newData: any) => void;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log('Cart props: ', props);

  const { increase, decrease, erase } = useCart();

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
  }, [props]);

  return (
    <Range gap='10' style={{ alignItems: 'center' }}>
      {props.check === true ? (
        <img
          src={'/images/toggleOn.png'}
          width={26}
          height={48}
          onClick={() => {
            onUpdate?.(props.num, { check: !props.check });
          }}
        />
      ) : (
        <img
          src={'/images/toggleOff.png'}
          width={26}
          height={48}
          onClick={() => {
            onUpdate?.(props.num, { check: !props.check });
          }}
        />
      )}

      <Range className={cartContainer}>
        <Image
          src={props?.image[0] || '/images/defaultImg.png'}
          width={130}
          height={130}
          alt='productImg'
          style={{ borderRight: '1px solid lightgray', cursor: 'pointer' }}
          onClick={() => router.push(`/${props.num}/info`)}
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
    </Range>
  );
}
