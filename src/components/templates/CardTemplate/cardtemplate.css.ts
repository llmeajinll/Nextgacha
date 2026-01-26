import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cardTemplateContainer = style({
  //   width: '1274px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 300px)',
  justifyContent: 'space-between',
  margin: '0 auto',
  gap: '10px',

  // border: '1px solid red',
});

export const noProductContainer = style({
  height: '300px',
  textAlign: 'center',
  alignItems: 'center',
  border: '1px solid lightgray',
  fontSize: '30px',
  fontFamily: 'silkscreen',
});
