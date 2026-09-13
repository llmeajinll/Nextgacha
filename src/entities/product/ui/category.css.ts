import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const categoryContainer = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.gray1}`,
  padding: '20px 30px',
  backgroundColor: 'white',
  gap: 10,
  zIndex: 12,
});

export const line = style({
  width: '100%',
  height: 1,
  backgroundColor: vars.color.gray1,
});

export const label = style({
  width: '100px',
  flex: '0 0 100px',
  fontSize: 16,
  lineHeight: '20px',
  fontWeight: 500,
});

export const sublabel = style({
  flex: '0 0 100px',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  marginBottom: 8,
});

export const content = style({
  width: 'fit-content',

  fontSize: 14,
  lineHeight: '20px',
  color: vars.color.black3,

  ':hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

export const select = style({
  color: vars.color.blue1,
});
