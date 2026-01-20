'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { EmptyCard, Ticket } from '@/components/molecules';
import { cartContainer, ticketContainer } from './cart.css';
import Link from 'next/link';
import { baseUrl } from '@/shared/baseUrl';
import { useModal, useCart } from '@/app/hooks';

export default function Cart({
  props,
  onClickCheck,
}: {
  props?: any;
  onClickCheck: (num: number, newData: any) => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  const { cart, keep, stock } = props;
  const { increase, decrease, erase } = useCart();

  console.log('cart, keep, stock : ', cart, keep, stock);

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

  console.log('cart', !cart);

  return (
    <>
      {!cart || !cart.list || cart.list.length === 0 ? (
        <EmptyCard>CART IS EMPTY</EmptyCard>
      ) : (
        <Range gap='10' style={{ alignItems: 'center' }}>
          <div style={{ cursor: 'pointer' }}>
            {cart.check === true ? (
              <img
                src={'/images/toggleOn.png'}
                width={26}
                height={48}
                onClick={() => {
                  console.log('check click');
                  onClickCheck(cart.num, { check: !cart.check });
                }}
              />
            ) : (
              <img
                src={'/images/toggleOff.png'}
                width={26}
                height={48}
                onClick={() => {
                  onClickCheck(cart.num, { check: !cart.check });
                }}
              />
            )}
          </div>

          <Range className={cartContainer}>
            <Image
              // src={props?.image[0] || '/images/defaultImg.png'}
              src={
                `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${cart.num}.png` ||
                '/images/defaultImg.png'
              }
              width={130}
              height={130}
              alt='productImg'
              style={{ borderRight: '1px solid lightgray', cursor: 'pointer' }}
              onClick={() => router.push(`/${cart.num}/info`)}
            />

            <Range preset='columnBetween'>
              <Range
                preset='left'
                gap='none'
                className={ticketContainer}
                ref={scrollRef}
              >
                {cart?.list.map((item: any, idx: number) => {
                  // const limit = props.list.find(
                  //   (val: { name: string; count: number }) => val.name === item.name
                  // );

                  const limit = { name: item.name, count: item.count };
                  const data = {
                    count: item.count,
                    title: stock.title,
                    price: stock.price,
                    discount: stock.discount,
                    code: item.code,
                    num: cart.num,
                    name: item.name,
                    limit: limit,
                  };

                  // console.log('data : ', data);

                  // console.log('ticket props in cart: ', props);
                  return (
                    <Ticket
                      key={idx}
                      props={data}
                      increase={() => {
                        const keepCount =
                          keep?.list?.find((v: any) => v.name === item.name)
                            ?.count ?? 0;
                        const stockCount =
                          stock?.list?.find((v: any) => v.name === item.name)
                            ?.count ?? 0;
                        increase(
                          keepCount,
                          stockCount,
                          cart.num,
                          item.name,
                          item.count
                        );
                      }}
                      decrease={() => decrease(cart.num, item.name, item.count)}
                      erase={() => erase(cart.num, item.name)}
                    />
                  );
                })}
              </Range>
            </Range>
          </Range>
        </Range>
      )}
    </>
  );
}
