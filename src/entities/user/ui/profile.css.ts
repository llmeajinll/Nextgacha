import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const profileImage = style({
  border: `1px solid ${vars.color.gray1}`,
  borderRadius: '300px',
});

export const name = style({
  fontSize: '20px',
  color: vars.color.black1,
});

export const email = style({
  fontSize: '14px',
  fontFamily: 'silkscreen',
  color: vars.color.blue1,
});

export const address = style({
  fontSize: '13px',
  color: vars.color.black1,
  marginTop: '-4px',
});

export const point = style({
  fontSize: '18px',
  lineHeight: '20px',
  fontFamily: 'silkscreen',
  color: vars.color.black2,
});
