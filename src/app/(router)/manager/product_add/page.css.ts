import { style } from '@vanilla-extract/css';

export const pageContainer = style({
  boxSizing: 'border-box',
  padding: '0px 30px 50px 30px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const fieldLabel = style({
  display: 'inline-block',
  width: '110px',
  fontSize: '18px',
});

export const plainLabel = style({
  fontSize: '18px',
});

export const imageInput = style({
  width: '200px',
  height: '200px',
  border: '1px solid lightgray',
});

const baseTextInput = style({
  height: '30px',
  border: '1px solid lightgray',
  padding: '4px 8px',
  fontSize: '18px',
});

export const titleInput = style([baseTextInput, { width: '400px' }]);
export const priceInput = style([baseTextInput, { width: '200px' }]);
export const listCountInput = style([baseTextInput, { width: '100px' }]);

export const selectField = style({
  width: '200px',
  height: '40px',
  border: '1px solid lightgray',
  padding: '4px 8px',
  fontSize: '18px',
});

export const deleteBtn = style({
  backgroundColor: 'white',
  border: 'none',
  height: '26px',
  fontSize: '30px',
  lineHeight: '10px',
  color: 'red',
  cursor: 'pointer',
});

export const deleteBtnSmall = style({
  backgroundColor: 'white',
  border: 'none',
  height: '26px',
  fontSize: '18px',
  lineHeight: '30px',
  color: 'red',
  cursor: 'pointer',
});

export const addListBtn = style({
  width: '344px',
  height: '40px',
  border: '1px solid lightgray',
  fontSize: '40px',
  lineHeight: '39px',
  color: 'gray',
  cursor: 'pointer',
});

export const submitBtn = style({
  height: '60px',
  border: '1px solid gray',
  marginTop: '50px',
  backgroundColor: 'gray',
  color: 'white',
  fontSize: '20px',
  lineHeight: '20px',
  cursor: 'pointer',
});

export const groupTag = style({
  fontSize: '18px',
  marginRight: '4px',
});
