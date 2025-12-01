import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const rightContent = style({
  fontSize: '14px',
  lineHeight: '24px',
  backgroundColor: vars.color.blue1,
  color: 'white',
  padding: '4px 12px 6px 14px',
  borderRadius: '50px',
  borderTopRightRadius: '0px',
  marginTop: '14px',
});

export const rightName = style({
  fontSize: '14px',
  fontFamily: 'silkscreen',
  lineHeight: '24px',
  color: vars.color.blue1,
  marginLeft: '6px',
});

export const leftContent = style({
  fontSize: '14px',
  lineHeight: '24px',
  backgroundColor: 'white',
  color: vars.color.blue1,
  padding: '4px 12px 6px 12px',
  borderRadius: '50px',
  borderTopLeftRadius: '0px',
  marginTop: '4px',
  border: `1px solid ${vars.color.blue1}`,
});

export const qnaContainer = style({
  width: '100%',
  border: `1px solid ${vars.color.gray1}`,
  padding: '10px 12px',
  boxSizing: 'border-box',
});

export const question = style({
  fontFamily: 'silkscreen',
  paddingTop: '0px',
  color: vars.color.blue1,
  fontSize: '24px',
  fontWeight: 'bold',
});

export const showBtn = style({
  backgroundColor: 'transparent',
  border: 'none',
  fontFamily: 'silkscreen',
  color: vars.color.blue1,
  padding: '0',
  cursor: 'pointer',
  height: '25px',
});
