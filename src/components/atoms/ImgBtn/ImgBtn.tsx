import React from 'react';
import Image from 'next/image';

const image = {
  share: '/images/share.png',
  dropdown: '/images/dropdown.png',
} as const;
type ImageKey = keyof typeof image; // "share" | "close"

type Props =
  | {
      img?: ImageKey;
      size: number;
      width?: never;
      height?: never;
      style?: any;
      onClick?: () => void;
    }
  | {
      img?: ImageKey;
      size?: never;
      width?: number;
      height?: number;
      style?: any;
      onClick?: () => void;
    };

export default function ImgBtn({
  img = 'share',
  size,
  width,
  height,
  style,
  onClick,
}: Props) {
  return (
    <Image
      src={image[img]}
      width={size || width}
      height={size || height}
      alt='like'
      onClick={onClick}
      style={{ cursor: 'pointer', ...style }}
    ></Image>
  );
}
