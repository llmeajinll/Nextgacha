import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const countBtn = style({
  width: '30px',
  height: '30px',
  color: 'white',
  border: 'none',
  backgroundColor: vars.color.blue1,
  cursor: 'pointer',
  fontSize: '24px',
  lineHeight: '30px',
});
