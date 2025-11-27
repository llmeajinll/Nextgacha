'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';

export default function StarBtn({
  value,
  onClick,
  disabled = false,
}: {
  value: boolean;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  disabled?: boolean;
}) {
  return (
    <Image
      style={{
        cursor: `${disabled ? 'auto' : 'pointer'}`,
      }}
      src={`/images/star_${value ? 'fill' : 'empty'}.png`}
      alt='star'
      width={25}
      height={25}
      onClick={disabled ? undefined : onClick}
    />
  );
}
