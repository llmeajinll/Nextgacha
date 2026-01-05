'use client';

import React, { useState, useEffect } from 'react';
import { Range, StarBtn } from '@/components/atoms';

type MyComponentProps = (
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
}: MyComponentProps) {
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

  return (
    <Range gap='4'>
      {list.map((val: number) => (
        <StarBtn
          key={val}
          value={score >= val}
          onClick={() => onClickBtn(val)}
          disabled={disabled}
          size={size}
        />
      ))}
    </Range>
  );
}
