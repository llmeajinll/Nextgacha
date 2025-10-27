import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cardTemplateContainer = style({
  //   width: '1274px',
  width: '100%',
  padding: '15px 0px',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 300px)',
  justifyContent: 'space-between',
  margin: '0 auto',

  // border: '1px solid red',
});
