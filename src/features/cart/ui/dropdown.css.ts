import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const dropdownContainer = style({
  display: 'flex',
  boxSizing: 'border-box',
  width: 480,
  height: 45,
  //   border: `1px solid ${vars.color.gray1}`,

  cursor: 'pointer',
});

export const dropdownTitle = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: 435,
  height: '100%',
  padding: '0 0 0 10px',
  color: vars.color.black1,
  borderTop: `1px solid ${vars.color.gray1}`,
  borderBottom: `1px solid ${vars.color.gray1}`,
  borderRight: `1px solid ${vars.color.gray1}`,
  fontSize: '16px',
  lineHeight: '43px',
});

export const listContainer = style({
  position: 'absolute',
  boxSizing: 'border-box',
  width: 480,
  height: 'fit-content',
  color: vars.color.black1,
  backgroundColor: 'white',
  borderBottom: `1px solid ${vars.color.gray1}`,
  borderRight: `1px solid ${vars.color.gray1}`,
  borderLeft: `1px solid ${vars.color.gray1}`,
  fontSize: '16px',
  lineHeight: '43px',
});

export const listStyle = style({
  boxSizing: 'border-box',
  width: 480,
  padding: '0 0 0 10px',
  color: vars.color.black1,
  lineHeight: '44px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#F1F1F1',
  },
});
