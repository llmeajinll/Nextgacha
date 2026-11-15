import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const deleteBtn = style({
  alignSelf: 'flex-end',
  background: 'none',
  border: 'none',
  padding: 4,
  fontSize: 13,
  color: vars.slate[600],
  textDecoration: 'underline',
  cursor: 'pointer',
});
