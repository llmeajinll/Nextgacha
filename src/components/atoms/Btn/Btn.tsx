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
  query?: { type?: string; detail?: string };
};

type BtnType = MajorBtnType | MoreBtnType;

type Props = BtnType & {
  children?: React.ReactNode | string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  style?: React.CSSProperties | undefined;
};

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
  return (
    <button
      onClick={props.onClick}
      style={props.style}
      className={`
        ${styles.btnSizeVariants[props.size ?? 'medium']} 
        ${styles.colorVariants[props.color ?? 'primary']} 
        ${btn}
        `}
    >
      {props.children}
    </button>
  );
}
