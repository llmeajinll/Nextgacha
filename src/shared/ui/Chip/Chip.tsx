'use client';

import React from 'react';
import { Close, Menu } from 'pixelarticons/react';
import * as s from './chip.css';

export type ChipProps = {
  children?: React.ReactNode;
  label?: React.ReactNode;
  onRemove?: () => void;
  removeTitle?: string;
  removeAriaLabel?: string;
  removeDisabled?: boolean;
  grip?: {
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    title?: string;
    ariaLabel?: string;
    describedBy?: string;
  };
  draggable?: boolean;
  dragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLSpanElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLSpanElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLSpanElement>) => void;
  className?: string;
};

export default function Chip({
  children,
  label,
  onRemove,
  removeTitle = '삭제',
  removeAriaLabel,
  removeDisabled = false,
  grip,
  draggable = false,
  dragging = false,
  onDragStart,
  onDragOver,
  onDragEnd,
  className,
}: ChipProps) {
  const content = label ?? children;
  const hasGrip = Boolean(grip);

  const rootClass = [
    s.chip,
    hasGrip ? s.chipWithGrip : s.chipWithoutGrip,
    dragging ? s.chipDragging : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      draggable={draggable}
      className={rootClass}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {grip && (
        <button
          type='button'
          className={s.gripBtn}
          aria-label={grip.ariaLabel || '순서 바꾸기'}
          aria-describedby={grip.describedBy}
          title={grip.title || '끌거나 화살표 키로 순서 바꾸기'}
          onKeyDown={grip.onKeyDown}
        >
          <Menu aria-hidden />
        </button>
      )}

      <span className={s.label}>{content}</span>

      {onRemove && (
        <button
          type='button'
          className={s.removeBtn}
          title={removeTitle}
          aria-label={removeAriaLabel || removeTitle}
          disabled={removeDisabled}
          onClick={onRemove}
        >
          <Close aria-hidden />
        </button>
      )}
    </span>
  );
}
