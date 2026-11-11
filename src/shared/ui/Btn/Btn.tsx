'use client';

import React from 'react';
import { btn, moreBtn } from './btn.css';
import * as styles from '@/styles/variants.css';
import { btn as uiBtn, btnKind, btnPx, btnSize } from '@/styles/ui.css';
import Link from 'next/link';

type MajorBtnType = {
  type?: 'major';
  size?: keyof typeof styles.btnSizeVariants;
  color?: keyof typeof styles.colorVariants;
  kind?: never;
};

// 디자인 시스템 버튼 (src/styles/ui.css.ts). kind가 있으면 size/color 대신 이 규칙을 따름
type UiBtnType = {
  type?: 'major';
  kind: keyof typeof btnKind;
  scale?: keyof typeof btnSize;
  // 영문 Silkscreen 라벨
  px?: boolean;
  size?: never;
  color?: never;
};

type MoreBtnType = {
  type: 'more';
  href: string;
  query?: { type?: string; detail?: string; tag?: string };
};

type Props = (MajorBtnType | UiBtnType | MoreBtnType) &
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

  if (props.kind) {
    const { type, kind, scale, px, className, children, ...rest } = props;
    return (
      <button
        {...rest}
        className={`${uiBtn} ${btnSize[scale ?? 'm']} ${btnKind[kind]} ${px ? btnPx : ''} ${className ?? ''}`}
      >
        {children}
      </button>
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
