import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const container = style({
  boxSizing: 'border-box',
  borderBottom: '1px solid lightgray',
  borderRight: '1px solid lightgray',
  borderLeft: '1px solid lightgray',
  padding: '20px 50px',
});

export const backLink = style({
  fontFamily: 'silkscreen',
  fontSize: '14px',
  lineHeight: '24px',
});

export const backArrow = style({
  color: vars.color.blue1,
});

export const titleRow = style({
  boxSizing: 'border-box',
  padding: '20px 20px 10px 20px',
});

export const num = style({
  fontFamily: 'silkscreen',
  marginRight: '5px',
  fontSize: '18px',
});

export const title = style({
  lineHeight: '14px',
  fontFamily: 'silkscreen',
});

export const createdAt = style({
  fontFamily: 'silkscreen',
  fontSize: '14px',
  lineHeight: '24px',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: 'lightgray',
});

export const content = style({
  boxSizing: 'border-box',
  padding: '20px',
  whiteSpace: 'pre-wrap',
  minHeight: '300px',
});

export const contentList = style({
  marginTop: '40px',
});

export const navRow = style({
  padding: '10px 20px',
  boxSizing: 'border-box',
  fontFamily: 'silkscreen',
});

export const navLink = style({
  color: 'gray',
  display: 'flex',
  alignItems: 'center',
});

export const navLinkNext = style([navLink, { marginLeft: 'auto' }]);

export const navIconLeft = style({
  marginRight: '5px',
});

export const navIconRight = style({
  marginLeft: '5px',
  rotate: '180deg',
});
