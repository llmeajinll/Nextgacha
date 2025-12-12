'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ticketContainer,
  contentContainer,
  character,
  title,
  countNumber,
  deleteBtn,
  priceStyle,
} from './ticket.css';
import { Range, CountBtn } from '@/components/atoms';
import { ProductProps } from '@/shared/type';
import { comma } from '@/shared/comma';

export default function Ticket({
  props,
  increase,
  decrease,
  erase,
}: {
  props: ProductProps;
  increase: (props: ProductProps) => void;
  decrease: (props: ProductProps) => void;
  erase: (num: string) => void;
}) {
  // console.log('ticket props: ', props);
  // const data = { ...props, count: 1 };

  // code: val.name + props.num,
  //                   name: val.name,
  //                   title: props.title,
  //                   count: 1,
  //                   price: props.price,
  //                   num: props.num,
  //                   limit: val.count,

  return (
    <div className={ticketContainer}>
      <div className={contentContainer}>
        <div className={character}>{props.name}</div>
        <div className={title}>{props.title}</div>
        <Range preset='between' style={{ marginTop: '15px' }}>
          <div className={priceStyle}>
            {comma(props.price * props.count)}won
          </div>
          <Image
            src='/images/trash.png'
            alt={'trash'}
            width={20}
            height={20}
            onClick={() => {
              if (window.confirm('삭제하시겠습니까?')) {
                // deleteToTempCart(props.code);
                erase(props.code);
              }
            }}
            className={deleteBtn}
          />
        </Range>
      </div>
      <Range preset='columnCenter' style={{ marginTop: '8px' }}>
        <CountBtn type='plus' onClick={() => increase(props)} />
        <div className={countNumber}>{props.count}</div>
        <CountBtn type='minus' onClick={() => decrease(props)} />
      </Range>
    </div>
  );
}
