import { style } from '@vanilla-extract/css';

export const pagePadding = style({
  padding: '30px',
});

export const searchLabel = style({
  marginBottom: '20px',
});

export const groupSelect = style({
  width: '500px',
  height: '40px',
  border: '1px solid lightgray',
  padding: '4px 8px',
  fontSize: '18px',
});

export const searchInput = style({
  width: '482px',
  height: '30px',
  border: '1px solid lightgray',
  padding: '4px 8px',
  fontSize: '18px',
  marginTop: '10px',
});

export const discountPanel = style({
  width: '700px',
});

export const discountLabel = style({
  lineHeight: '35px',
  fontSize: '18px',
  marginRight: '10px',
});

export const discountPercentLabel = style({
  lineHeight: '35px',
  fontSize: '18px',
  marginLeft: '5px',
});

export const discountInput = style({
  width: '100px',
  height: '30px',
  border: '1px solid lightgray',
  padding: '4px 8px',
  fontSize: '18px',
});

export const checkboxSmall = style({
  width: '20px',
  height: '20px',
});

export const checkboxLabel = style({
  lineHeight: '25px',
  fontSize: '18px',
});

export const applyBtn = style({
  backgroundColor: '#75C3FE',
  width: '475px',
  height: '40px',
  color: 'white',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  lineHeight: '38px',
});

export const productGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 600px)',
  marginTop: '30px',
});

export const productRow = style({
  width: '600px',
});

export const productImage = style({
  border: '1px solid lightgray',
});

export const productInfoBlock = style({
  marginLeft: '8px',
  height: '120px',
});

export const titleReset = style({
  margin: '0',
});

export const titleText = style({
  fontSize: '18px',
  height: '52px',
});

export const reserveTag = style({
  color: '#75C3FE',
  fontSize: '14px',
});

export const alreadyDiscountTag = style({
  color: '#8e75fe',
  fontSize: '14px',
  marginRight: '8px',
});

export const strikePrice = style({
  color: 'lightgray',
  textDecoration: 'line-through',
});

export const paginationWrap = style({
  margin: '80px auto 30px auto',
});
