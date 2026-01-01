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

export const addressInput = style({
  width: '400px',
  padding: '8px',
  border: `1px solid lightgray`,
  // borderRadius: '4px',
  fontSize: '14px',
  color: vars.color.black1,
});

export const addressBtn = style({
  width: '60px',
  padding: '8px',
  fontSize: '14px',
  color: 'white',
  backgroundColor: vars.color.blue1,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'silkscreen',
});
