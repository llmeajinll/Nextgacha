import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const profileImage = style({
  border: `1px solid ${vars.color.gray1}`,
  borderRadius: '300px',
});

export const email = style({
  fontSize: '14px',
  fontFamily: 'silkscreen',
  color: vars.color.blue1,
});

export const point = style({
  fontSize: '18px',
  lineHeight: '20px',
  fontFamily: 'silkscreen',
  color: vars.color.black2,
});
