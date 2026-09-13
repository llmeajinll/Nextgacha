'use client';

import React from 'react';
import { countBtn } from './countBtn.css';

type CountBtntype = {
  type: 'minus' | 'plus';
};

type Props = CountBtntype & {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
};

export default function CountBtn(props: Props) {
  const { type, onClick, style } = props;
  return (
    <button className={countBtn} onClick={onClick} style={{ ...style }}>
      {type === 'minus' ? '-' : '+'}
    </button>
  );
}
