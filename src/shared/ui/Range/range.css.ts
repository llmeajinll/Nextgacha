import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const rangeWidth = createVar();
export const rangeHeight = createVar();
export const rangeGap = createVar();

export const range = style({
  display: 'flex',
});
