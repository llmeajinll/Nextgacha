'use client';

import React from 'react';
import { range } from './range.css';
import { widthVariant, heightVariant, gapVariant, rangePresetVariant } from '@/styles/variants.css';

// flex 상자. 폭·높이·간격·정렬은 variants.css.ts의 variant 이름으로만 받는다 (inline style 없음)
type Props = {
  width?: keyof typeof widthVariant;
  height?: keyof typeof heightVariant;
  gap?: keyof typeof gapVariant;
  preset?: keyof typeof rangePresetVariant;
  children?: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
};

export default function Range({ width, height, gap, className, preset, ref, children }: Props) {
  return (
    <div
      className={`${range} ${widthVariant[width ?? 'fit']} ${heightVariant[height ?? 'fit']} ${gapVariant[gap ?? 'none']} ${rangePresetVariant[preset ?? 'center']} ${className ?? ''}`}
      ref={ref}
    >
      {children}
    </div>
  );
}
