'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Range } from '@/shared/ui';
import { starPointer, starAuto } from './starBtn.css';

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
      className={disabled ? starAuto : starPointer}
      src={`/images/star_${value ? 'fill' : 'empty'}.png`}
      alt='star'
      width={size === 'big' ? 40 : 25}
      height={size === 'big' ? 40 : 25}
      onClick={disabled ? undefined : onClick}
    />
  );
}
