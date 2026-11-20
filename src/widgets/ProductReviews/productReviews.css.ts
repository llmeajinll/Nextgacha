import { style } from '@vanilla-extract/css';

export const emptyState = style({
  boxSizing: 'border-box',
  border: '1px solid lightgray',
  padding: '50px',
  fontSize: '20px',
});

export const listWrap = style({
  width: '100%',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 460px)',
  justifyContent: 'space-between',
  margin: '0 auto',
  width: '100%',
  rowGap: '40px',
});

export const moreBtn = style({
  width: '100%',
  height: '30px',
  backgroundColor: 'white',
  color: 'gray',
  marginTop: '30px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'silkscreen',
  fontSize: '20px',
});
