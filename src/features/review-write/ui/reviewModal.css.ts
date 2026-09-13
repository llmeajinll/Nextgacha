import { style, createVar } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const fontSizeVar = createVar();

export const textareaStyle = style({
  width: '550px',
  height: '100px',
  padding: '8px',
  resize: 'none',
  border: '1px solid lightgray',
  fontFamily: 'notosans',
  fontSize: '14px',
});
export const Text = style({
  fontSize: fontSizeVar,
  color: vars.color.blue1,
  marginTop: '2px',
});

export const warningText = style({
  fontSize: '16px',
  fontWeight: '500',
  color: '#3aaaff',
});

export const titleLabel = style({
  fontWeight: '500',
  fontSize: '14px',
  color: vars.color.black1,
});
export const contentLabel = style({
  width: '450px',
  fontSize: '14px',
  color: vars.color.black1,
});

export const detailContentLabel = style({
  fontSize: '12px',
  color: vars.color.black1,
});

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 50,
});

export const headerBar = style({
  backgroundColor: vars.color.blue1,
  border: `1px solid ${vars.color.blue1}`,
});

export const fieldGroup = style({
  marginBottom: '10px',
});
