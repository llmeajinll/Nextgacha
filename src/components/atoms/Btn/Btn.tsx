import React from 'react';
import { btn } from './btn.css';
import * as styles from '@/styles/variants.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

type Props = {
  size?: 'small' | 'medium';
  color?: 'primary' | 'reversePrimary';
  text: string;
  children?: React.ReactNode;
};

export default function Btn({
  size = 'medium',
  color = 'primary',
  text = '입력',
  children,
}: Props) {
  return (
    <button
      className={`${styles.btnSizeVariants[size]} ${styles.colorVariants[color]} ${btn}`}
    >
      {text}
    </button>
  );
}
