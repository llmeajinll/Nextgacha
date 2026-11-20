import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

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
  border: `4px solid ${vars.color.blue1}`,
  padding: '10px',
  backgroundColor: vars.color.blueBg,
});

export const wrapTextareaContainer = style({
  boxSizing: 'border-box',
  width: '930px',
  border: `2px solid ${vars.color.blue1}`,
  padding: '10px',
  backgroundColor: 'white',
});

export const profileImage = style({
  border: `2px solid ${vars.color.blueLight}`,
  borderRadius: '50px',
  backgroundColor: 'white',
  backgroundSize: '120%',
});

export const secretToggleRow = style({
  fontFamily: 'silkscreen',
  alignItems: 'center',
  paddingTop: '3px',
});

export const secretLabel = style({
  paddingTop: '3px',
  color: vars.color.black1,
});

export const postBtn = style({
  marginLeft: 'auto',
});
