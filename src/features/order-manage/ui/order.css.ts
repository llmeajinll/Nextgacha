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

export const orderBody = style({
  width: '580px',
});

export const reasonRow = style({
  fontWeight: 'bold',
  marginBottom: '8px',
});

export const spacedText = style({
  marginRight: '10px',
});

export const marginLeft20 = style({
  marginLeft: '20px',
});

export const marginRight20 = style({
  marginRight: '20px',
});

export const inputWide = style([inputStyle, { width: '250px' }]);

export const marginTopSm = style({
  marginTop: '10px',
});

export const refundBtn = style([
  sendingBtn,
  { backgroundColor: 'gray', marginLeft: '10px' },
]);
