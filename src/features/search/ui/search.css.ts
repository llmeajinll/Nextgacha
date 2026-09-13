import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const search = style({
  display: 'flex',
  alignItems: 'center',
  width: 300,
  height: 31,
  borderRadius: 35,
  border: `2px solid ${vars.color.gray1}`,
  padding: '0 10px',
  color: vars.color.black1,
  fontFamily: 'notosans',
});

export const inputStyle = style({
  outline: 'none',
  marginLeft: '5px',
  border: 'none',
  flex: 1,
  fontFamily: 'silkscreen',
  lineHeight: '21px',
});
