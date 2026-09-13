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
  priceRow,
  countRow,
  strikePrice,
} from './ticket.css';
import { Range, CountBtn } from '@/shared/ui';
import { ProductProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import { useModal } from '@/shared/hooks';

export default function Ticket({
  props,
  increase,
  decrease,
  erase,
}: // onClick,
{
  props: any;
  // props: ProductProps;
  increase: (props: ProductProps) => void;
  decrease: (props: ProductProps) => void;
  erase: (props: ProductProps) => void;
}) {
  const { openModal } = useModal();
  // console.log('ticket : ', props);
  return (
    <div className={ticketContainer}>
      <div className={contentContainer}>
        <div className={character}>{props.name}</div>
        <div className={title}>{props.title}</div>
        <Range preset='between' className={priceRow}>
          <div className={priceStyle}>
            {props.discount !== 0 && (
              <span className={strikePrice}>{props.price}</span>
            )}
            {comma(props.price * (1 - props.discount / 100) * props.count)} won
          </div>
          <Image
            className={deleteBtn}
            src='/images/trash.png'
            alt={'trash'}
            width={20}
            height={20}
            onClick={() => erase(props)}
          />
        </Range>
      </div>
      <Range preset='columnCenter' className={countRow}>
        <CountBtn type='plus' onClick={() => increase(props)} />
        {/* <CountBtn type='plus' onClick={() => onClick(props)} /> */}
        <div className={countNumber}>{props.count}</div>
        <CountBtn type='minus' onClick={() => decrease(props)} />
      </Range>
    </div>
  );
}
