import React from 'react';
import {
  wrapperNone,
  wrapperVertical,
  imgBase,
  imgVertical,
} from './toggleBtn.css';

export default function ToggleBtn({
  value,
  setValue,
  rotate = 'none',
}: {
  value: boolean;
  setValue: React.SetStateAction<any>;
  rotate?: 'none' | 'vertical';
}) {
  return (
    <div className={rotate === 'none' ? wrapperNone : wrapperVertical}>
      <img
        src={value ? '/images/toggleOn.png' : '/images/toggleOff.png'}
        onClick={() => {
          setValue(!value);
        }}
        className={rotate === 'none' ? imgBase : imgVertical}
      />
    </div>
  );
}
