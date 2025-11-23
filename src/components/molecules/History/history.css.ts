import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const imageStyle = style({
  border: `1px solid ${vars.color.gray1}`,
});
export const Title = style({
  boxSizing: 'border-box',
  color: vars.color.black1,
  fontSize: '20px',
});

export const contentStyle = style({
  color: vars.color.black1,
});
