import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const btn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: `1px solid ${vars.color.blue1}`,
  fontFamily: 'silkScreen',
  cursor: 'pointer',
});
