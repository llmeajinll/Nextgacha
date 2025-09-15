import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const headerContainer = style({
  //   backgroundColor: 'red',
  width: 1314,
  borderBottom: `1px solid ${vars.color.gray1}`,
});

export const menuContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: 980,
  height: 60,
  margin: '0 auto',
  fontFamily: 'silkscreen',
  color: vars.color.black1,
});

export const logo = style({
  height: 35,
  fontSize: 24,
  letterSpacing: -1.2,
  marginRight: 20,
  cursor: 'pointer',
});

export const menu = style({
  marginLeft: 20,
  fontSize: 14,
  letterSpacing: -0.7,
  cursor: 'pointer',
});

export const wrap = style({
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
});

export const search = style({
  width: 300,
  height: 31,
  borderRadius: 35,
  border: `2px solid ${vars.color.gray1}`,
});
