'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'pixelarticons/react';
import { Range, ImgBtn } from '@/shared/ui';
import { iconOn, iconOff } from '../ImgBtn/imgBtn.css';

type Props = (
  | {
      disabled: true;
      value: number;
      setValue?: never;
    }
  | {
      disabled?: false;
      value: number;
      setValue: React.Dispatch<React.SetStateAction<number>>;
    }
) & {
  size?: 'medium' | 'big';
};

export default function StarRating({
  disabled = false,
  // value = 0,
  value,
  setValue,
  size = 'medium',
}: Props) {
  let list = [1, 2, 3, 4, 5];
  const [score, setScore] = useState<number>(value);

  const onClickBtn = (nextScore: number) => {
    setScore(nextScore);

    if (typeof setValue === 'function') {
      setValue(nextScore);
    }
  };

  useEffect(() => {
    if (typeof setValue === 'function') {
      setValue(score);
    }
  }, [score, setValue]);

  const px = size === 'big' ? 40 : 25;

  return (
    <Range gap='4'>
      {list.map((val: number) =>
        disabled ? (
          <Star
            key={val}
            width={px}
            height={px}
            className={score >= val ? iconOn : iconOff}
            aria-hidden
          />
        ) : (
          <ImgBtn
            key={val}
            img='star'
            size={px}
            title={`${val}점`}
            active={score >= val}
            onClick={() => onClickBtn(val)}
          />
        ),
      )}
    </Range>
  );
}
