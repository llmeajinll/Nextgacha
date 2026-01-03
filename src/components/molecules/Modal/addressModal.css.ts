import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const addressContainer = style({
  position: 'absolute',
  width: 'fit-content',
  background: 'white',
  border: '1px solid lightgray',
  alignItems: 'center',
  padding: '8px 10px',
  right: '-450px',
  top: '5px',
  //   left: '140px',
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

export const writeBtn = style({
  width: 'fit-content',
  margin: '0px 0px 4px auto',
  cursor: 'pointer',
  fontSize: '14px',
  color: vars.color.black1,
});
