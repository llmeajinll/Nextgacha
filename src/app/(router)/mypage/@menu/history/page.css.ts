import { style } from '@vanilla-extract/css';

export const grid = style({
  padding: '20px 0 0 0',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 310px)',
  justifyContent: 'space-between',
  margin: '0 auto',
  gap: '10px',
});

export const paginationWrap = style({
  margin: '80px auto 30px auto',
});
