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

export const profileImage = style({
  border: '2px solid #BFE3FF',
  borderRadius: '50px',
  backgroundColor: 'white',
  backgroundSize: '120%',
});

export const charCount = style({
  marginLeft: 'auto',
  fontFamily: 'silkscreen',
});

export const secretToggleRow = style({
  fontFamily: 'silkscreen',
  alignItems: 'center',
  paddingTop: '3px',
});

export const secretLabel = style({
  paddingTop: '3px',
  color: '#6F6F6F',
});

export const postBtn = style({
  marginLeft: 'auto',
});

export const emptyState = style({
  boxSizing: 'border-box',
  border: '1px solid lightgray',
  padding: '50px',
  fontSize: '20px',
});
