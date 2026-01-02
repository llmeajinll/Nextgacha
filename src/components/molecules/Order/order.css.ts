import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const inputStyle = style({
  //   width: '200px',
  height: '30px',
  border: `1px solid ${vars.color.gray1}`,
  paddingLeft: '8px',
  fontSize: '16px',
});

export const sendingBtn = style({
  border: 'none',
  backgroundColor: vars.color.blue1,
  color: 'white',
  fontSize: '16px',
  padding: '8px 20px',

  cursor: 'pointer',
});

export const checkBox = style({
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  marginTop: '25px',
});
