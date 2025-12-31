'use client';

import React, { useState, useEffect } from 'react';
import { Range, StarBtn } from '@/components/atoms';

export default function StarRating({
  disabled = false,
  value = 0,
}: {
  disabled?: boolean;
  value?: number;
}) {
  let list = [1, 2, 3, 4, 5];
  const [score, setScore] = useState(value);

  const onClickBtn = (score: number) => {
    // console.log(score);
    setScore(score);
  };

  useEffect(() => {
    setScore(score);
  }, [score]);
  return (
    <Range gap='4'>
      {list.map((val: number) => (
        <StarBtn
          key={val}
          value={score >= val}
          onClick={() => onClickBtn(val)}
          disabled={disabled}
        />
      ))}
    </Range>
  );
}
