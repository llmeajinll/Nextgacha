'use client';

import React from 'react';
import { btn, moreBtn } from './btn.css';
import * as styles from '@/styles/variants.css';
import Link from 'next/link';

type MajorBtnType = {
  type?: 'major';
  size?: keyof typeof styles.btnSizeVariants;
  color?: keyof typeof styles.colorVariants;
};

type MoreBtnType = {
  type: 'more';
  href: string;
  query?: { type?: string; detail?: string; tag?: string };
};

type Props = (MajorBtnType | MoreBtnType) &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export default function Btn(props: Props) {
  if ('type' in props && props.type === 'more') {
    return (
      <Link
        href={{
          pathname: `/${props.href}`,
          query: props.query,
        }}
      >
        <button className={moreBtn}>더보기 ⟩</button>
      </Link>
    );
  }

  const { type, size, color, className, children, ...rest } = props;

  return (
    <button
      {...rest}
      className={`
        ${styles.btnSizeVariants[size ?? 'medium']}
        ${styles.colorVariants[color ?? 'primary']}
        ${btn}
        ${className}
        `}
    >
      {children}
    </button>
  );
}
