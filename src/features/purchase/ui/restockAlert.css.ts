import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const box = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 12px',
  backgroundColor: vars.tone.soldout.bg,
});

export const text = style({ fontSize: 14, color: vars.slate[700] });
