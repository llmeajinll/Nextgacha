'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ticketContainer,
  contentContainer,
  character,
  title,
  countNumber,
} from './ticket.css';
import { Range, CountBtn } from '@/components/atoms';
import { ProductProps } from '@/shared/type';

export default function Ticket({ props }: { props: ProductProps }) {
  const [count, setCount] = useState(1);
  const MAX = 5;
  return (
    <div className={ticketContainer}>
      <div className={contentContainer}>
        <div className={character}>{props.name}</div>
        <div className={title}>{props.title}</div>
      </div>
      <Range preset='columnCenter'>
        <CountBtn
          type='minus'
          onClick={() =>
            setCount((prev) => {
              if (count === 1) {
                alert('상품을 삭제하시겠습니까?');
                return prev;
              } else {
                return (prev -= 1);
              }
            })
          }
        />
        <div className={countNumber}>{props.count}</div>
        <CountBtn
          type='plus'
          onClick={() =>
            setCount((prev) => {
              if (count === 5) {
                alert('상품은 최대 5개까지만 담을 수 있습니다.');
                return prev;
              } else {
                return (prev += 1);
              }
            })
          }
        />
      </Range>
    </div>
  );
}
