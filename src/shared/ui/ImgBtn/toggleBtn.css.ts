import { style } from '@vanilla-extract/css';

const wrapperBase = style({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const wrapperNone = style([wrapperBase, { width: '26px', height: '48px' }]);
export const wrapperVertical = style([
  wrapperBase,
  { width: '48px', height: '26px' },
]);

export const imgBase = style({
  width: '26px',
  height: '48px',
});

export const imgVertical = style([imgBase, { transform: 'rotate(90deg)' }]);
