'use client';

import React from 'react';
import { range, rangeWidth, rangeHeight, rangeGap } from './range.css';
import {
  widthVariant,
  heightVariant,
  gapVariant,
  directionVariant,
  justifyVariant,
  alignVariant,
} from '@/styles/variants.css';

// type Props = {
//   width?: 'fit' | 'full' | '960' | number;
//   height?: 'fit' | 'full' | number;
//   gap?: '10' | '15' | '30' | number;
//   direction?: 'row' | 'column';
//   justify?: 'spacebetween' | 'center' | 'start';
//   align?: 'center' | 'stretch';
//   addStyle?: any;
//   children?: React.ReactNode;
// };

type Props = {
  width?: 'fit' | 'full' | '960';
  height?: 'fit' | 'full';
  gap?: 'none' | '10' | '15' | '30';
  direction?: 'row' | 'column';
  justify?: 'spacebetween' | 'center' | 'start';
  align?: 'center' | 'stretch';
  addStyle?: any;
  children?: React.ReactNode;
};

export default function Range({
  width = 'fit',
  height = 'fit',
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 'none',
  addStyle,
  children,
}: Props) {
  console.log(width, height, direction, gap, justify, align, addStyle);

  //   let inlineVars: Record<string, string> = {};

  //   let widthClass = widthVariant.fit;
  //   if (width === 'fit') widthClass = widthVariant.fit;
  //   else if (width === 'full') widthClass = widthVariant.full;
  //   else {
  //     widthClass = widthVariant.dynamic;
  //     inlineVars[rangeWidth] = `${width}px`;
  //   }

  //   let heightClass = heightVariant.fit;
  //   if (height === 'fit') heightClass = heightVariant.fit;
  //   else if (height === 'full') heightClass = heightVariant.full;
  //   else {
  //     heightClass = heightVariant.dynamic;
  //     inlineVars[rangeHeight] = `${height}px`;
  //   }

  //   let gapClass = gapVariant.none;
  //   if (gap !== undefined) {
  //     gapClass = gapVariant.dynamic;
  //     inlineVars[rangeGap] = `${gap}px`;
  //   }

  //   const inlineStyles: React.CSSProperties = {
  //     ...(typeof width === 'number' && { [rangeWidth]: `${width}px` }),
  //     ...(typeof height === 'number' && { [rangeHeight]: `${height}px` }),
  //     ...(typeof gap === 'number' && { [rangeGap]: `${gap}px` }),
  //   };

  //   console.log(inlineStyles);

  let inlineStyles = {};

  return (
    <div
      className={`
        ${range} 
        ${widthVariant[width]} 
        ${heightVariant[height]} 
        ${gapVariant[gap]} 
        ${directionVariant[direction]} 
        ${justifyVariant[justify]}
        ${alignVariant[align]}
        `}
      style={{ ...addStyle, ...inlineStyles }}
    >
      {children}
    </div>
  );
}
