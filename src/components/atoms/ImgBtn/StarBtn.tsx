'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';

export default function StarBtn({
  value,
  onClick,
  disabled = false,
  size = 'medium',
}: {
  value: boolean;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  disabled?: boolean;
  size?: 'medium' | 'big';
}) {
  return (
    <Image
      style={{
        cursor: `${disabled ? 'auto' : 'pointer'}`,
      }}
      src={`/images/star_${value ? 'fill' : 'empty'}.png`}
      alt='star'
      width={size === 'big' ? 40 : 25}
      height={size === 'big' ? 40 : 25}
      onClick={disabled ? undefined : onClick}
    />
  );
}
