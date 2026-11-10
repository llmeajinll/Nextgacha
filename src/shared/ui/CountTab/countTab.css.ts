import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const tab = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  fontSize: 14,
  color: vars.slate[800],
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

export const tabOn = style({
  borderColor: vars.color.blue1,
  backgroundColor: vars.color.blue1,
  color: 'white',
  fontWeight: 600,
});

export const count = style({
  minWidth: 22,
  height: 22,
  boxSizing: 'border-box',
  padding: '0 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'silkscreen',
  fontSize: 12,
  backgroundColor: vars.slate[100],
  color: vars.slate[600],
});

globalStyle(`${tabOn} ${count}`, { backgroundColor: 'white', color: vars.ink[500] });
