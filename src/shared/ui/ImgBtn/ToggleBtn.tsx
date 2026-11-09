import React from 'react';
import { Checkbox, CheckboxOn } from 'pixelarticons/react';
import { imgBtnBase } from './imgBtn.css';

export default function ToggleBtn({
  value,
  setValue,
  label,
  size = 26,
}: {
  value: boolean;
  setValue: (next: boolean) => void;
  label?: string;
  size?: number;
}) {
  const Icon = value ? CheckboxOn : Checkbox;
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={value}
      aria-label={label}
      onClick={() => setValue(!value)}
      className={imgBtnBase}
    >
      <Icon width={size} height={size} aria-hidden />
    </button>
  );
}
