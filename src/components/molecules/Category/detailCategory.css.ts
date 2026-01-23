import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const filterContainer = style({
  flexWrap: 'wrap',
});

export const filterStyle = style({
  padding: '4px 10px',
  borderRadius: '50px',
  cursor: 'pointer',
  border: `1px solid ${vars.color.blue1}`,
});

export const selectStyle = style({
  backgroundColor: vars.color.blue1,
  color: 'white',
});

export const normalStyle = style({
  backgroundColor: 'white',
  color: vars.color.blue1,
});
