'use client';

import React from 'react';
import Image from 'next/image';
import { imgBtnBase } from './imgBtn.css';

const image = {
  share: '/images/share.png',
  dropdown: '/images/dropdown.png',
  close: '/images/closeBtn.png',
  post: '/images/post.png',
  report: '/images/report.png',
} as const;
type ImageKey = keyof typeof image; // "share" | "close" | "dropdown" | "post" | "report"

type Props =
  | {
      img?: ImageKey;
      size: number;
      width?: never;
      height?: never;
      title?: string;
      className?: string;
      onClick?: () => void;
    }
  | {
      img?: ImageKey;
      size?: never;
      width?: number;
      height?: number;
      title?: string;
      className?: string;
      onClick?: () => void;
    };

export default function ImgBtn({
  img = 'share',
  size,
  width,
  height,
  title,
  className,
  onClick,
}: Props) {
  return (
    <img
      src={image[img]}
      width={size || width}
      height={size || height}
      title={title}
      alt='like'
      onClick={onClick}
      className={`${imgBtnBase} ${className ?? ''}`}
    />
  );
}
