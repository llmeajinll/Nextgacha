'use client';

import React from 'react';
import { countBtn } from './countBtn.css';

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type: 'minus' | 'plus';
};

export default function CountBtn({ type, className, ...rest }: Props) {
  return (
    <button className={`${countBtn} ${className ?? ''}`} {...rest}>
      {type === 'minus' ? '-' : '+'}
    </button>
  );
}
