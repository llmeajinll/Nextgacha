import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const form = style({ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' });

export const textarea = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: 10,
  border: `1px solid ${vars.slate[200]}`,
  fontSize: 14,
  resize: 'vertical',
});

export const row = style({ display: 'flex', justifyContent: 'flex-end', gap: 8 });
