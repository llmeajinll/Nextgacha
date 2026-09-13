import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const qnaTemplateContainer = style({
  //   width: '1274px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 630px)',
  justifyContent: 'space-between',
  margin: '30px auto 0px auto',
  gap: '25px',

  // border: '1px solid red',
});

export const textareaStyle = style({
  boxSizing: 'border-box',
  width: '842px',
  height: '100px',
  border: 'none',
  fontSize: '16px',
  resize: 'none',
  outline: 'none',
  fontFamily: 'Noto Sans Kr',
  color: vars.color.black2,
});

export const wrapQnaContainer = style({
  boxSizing: 'border-box',
  marginBottom: '5px',
  border: '4px solid #75C3FE',
  padding: '10px',
  backgroundColor: '#ddf0fd',
});

export const wrapTextareaContainer = style({
  boxSizing: 'border-box',
  width: '930px',
  border: '2px solid #75C3FE',
  padding: '10px',
  backgroundColor: 'white',
});
