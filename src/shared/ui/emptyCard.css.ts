import { style } from '@vanilla-extract/css';

export const emptyCard = style({
  boxSizing: 'border-box',
  width: '100%',
  height: '130px',
  padding: '20px',
  border: '1px solid lightgray',
  fontFamily: 'silkscreen',
  color: 'gray',
  fontSize: '30px',
  textAlign: 'center',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  lineHeight: '24px',
  marginTop: '15px',
});

export const noMarginTop = style({
  marginTop: 0,
});
