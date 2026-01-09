import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const CartContainer = style({
  width: '100%',
  marginBottom: '50px',
  padding: '15px 0px',
});

export const bigText = style({
  fontFamily: 'silkscreen',
  fontSize: '24px',
  lineHeight: '22px',
});

export const smallText = style({
  fontFamily: 'silkscreen',
  fontSize: '18px',
});

export const pointInput = style({
  width: '100px',
  textAlign: 'right',
  height: '30px',
  border: '1px solid lightgray',
  color: vars.color.black2,
  fontFamily: 'silkscreen',
  fontSize: '16px',
  outline: 'none',
});
export const pointInputFocused = style({
  width: '100px',
  textAlign: 'right',
  height: '30px',
  border: `1px solid ${vars.color.blue1}`,
  fontFamily: 'silkscreen',
  fontSize: '18px',
  outline: 'none',
});

export const line = style({
  width: '100%',
  height: '1px',
  backgroundColor: 'lightgray',
  margin: '5px 0px',
});
