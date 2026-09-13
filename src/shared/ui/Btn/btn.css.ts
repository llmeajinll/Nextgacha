import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const btn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: `1px solid ${vars.color.blue1}`,
  fontFamily: 'silkScreen',
  cursor: 'pointer',
});

export const moreBtn = style({
  width: '100%',
  height: '60px',
  color: vars.color.black3,
  backgroundColor: 'white',
  fontSize: '20px',
  lineHeight: '60px',
  textAlign: 'center',
  border: 'none',
  borderTop: `1px solid ${vars.color.gray1}`,
  // marginTop: '15px',
  cursor: 'pointer',
});
