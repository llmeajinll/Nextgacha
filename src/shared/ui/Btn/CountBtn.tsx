'use client';

import React from 'react';
import { countBtn } from './countBtn.css';

type CountBtntype = {
  type: 'minus' | 'plus';
};

type Props = CountBtntype & {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function CountBtn(props: Props) {
  const { type, onClick } = props;
  return (
    <button className={countBtn} onClick={onClick}>
      {type === 'minus' ? '-' : '+'}
    </button>
  );
}
