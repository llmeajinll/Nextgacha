import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const wrap = style({ display: 'flex', justifyContent: 'flex-end', marginTop: 40 });

export const link = style({
  background: 'none',
  border: 'none',
  padding: 4,
  fontSize: 13,
  color: vars.slate[600],
  textDecoration: 'underline',
  cursor: 'pointer',
});
