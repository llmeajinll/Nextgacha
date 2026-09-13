import { style } from '@vanilla-extract/css';

export const searchInput = style({
  width: '500px',
  border: '1px solid lightgray',
  padding: '8px 5px 7px 5px',
  fontSize: '18px',
  color: '#4c4c4c',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 640px)',
  marginTop: '30px',
});
