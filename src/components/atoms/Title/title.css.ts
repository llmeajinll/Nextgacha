import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const title = style({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 60,
  borderBottom: `1px solid ${vars.color.gray1}`,
  //   padding: '0 10px',
  color: vars.color.black1,
  margin: '0 auto 15px auto',
  fontSize: 24,
  lineHeight: '60px',
  letterSpacing: '-1.2px',
  //   fontWeight: '500',
});
