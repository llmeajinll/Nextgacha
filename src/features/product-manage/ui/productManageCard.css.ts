import { style } from '@vanilla-extract/css';

export const cardContainer = style({
  width: '640px',
});

export const itemGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 300px)',
});

export const itemRow = style({
  width: '300px',
  alignItems: 'center',
});

const baseEditInput = style({
  border: '1px solid lightgray',
  padding: '5px 4px 4px 4px',
  fontSize: '18px',
  color: '#4c4c4c',
});

export const nameInput = style([baseEditInput, { width: '200px' }]);
export const countInput = style([baseEditInput, { width: '50px' }]);
export const priceInput = style([baseEditInput, { width: '90px' }]);

export const totalCount = style({
  marginTop: '20px',
  fontSize: '20px',
});

export const summaryRow = style({
  marginTop: '20px',
});

export const priceDisplay = style({
  fontSize: '20px',
});

const baseActionBtn = style({
  border: 'none',
  color: 'white',
  fontSize: '18px',
  padding: '8px 16px',
  lineHeight: '22px',
  cursor: 'pointer',
});

export const editBtn = style([baseActionBtn, { backgroundColor: '#75C3FE' }]);
export const cancelBtn = style([baseActionBtn, { backgroundColor: 'lightgray' }]);
