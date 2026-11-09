'use client';

import React from 'react';
import { ChevronDown, Close, Heart, Mail, Share, Siren, Star } from 'pixelarticons/react';
import { imgBtnBase, iconOn, iconOff } from './imgBtn.css';

const icon = {
  share: Share,
  dropdown: ChevronDown,
  close: Close,
  post: Mail,
  report: Siren,
  heart: Heart,
  star: Star,
} as const;
type IconKey = keyof typeof icon;

type Props = {
  img?: IconKey;
  title?: string;
  // 켜짐/꺼짐이 있는 버튼(좋아요, 별점). 지정하면 색으로 상태를 표시
  active?: boolean;
  className?: string;
  onClick?: () => void;
} & (
  | { size: number; width?: never; height?: never }
  | { size?: never; width?: number; height?: number }
);

export default function ImgBtn({
  img = 'share',
  size,
  width,
  height,
  title,
  active,
  className,
  onClick,
}: Props) {
  const Icon = icon[img];
  return (
    <button
      type='button'
      title={title}
      aria-label={title ?? img}
      aria-pressed={active}
      onClick={onClick}
      className={`${imgBtnBase} ${active === undefined ? '' : active ? iconOn : iconOff} ${className ?? ''}`}
    >
      <Icon width={size || width} height={size || height} aria-hidden />
    </button>
  );
}
