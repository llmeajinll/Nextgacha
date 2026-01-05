import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const orderTemplateContainer = style({
  //   width: '1274px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 630px)',
  justifyContent: 'space-between',
  margin: '30px auto 0px auto',
  gap: '25px',

  // border: '1px solid red',
});

export const sendBtnStyle = style({
  width: '220px',
  height: '50px',
  border: 'none',
  fontSize: '18px',
  color: 'white',
  marginTop: '30px',
  backgroundColor: vars.color.blue1,
  cursor: 'pointer',
});
