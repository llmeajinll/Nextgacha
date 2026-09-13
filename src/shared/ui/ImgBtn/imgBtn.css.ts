import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const imgBtn = style({
  width: '100%',
  height: '60px',
  fontSize: '20px',
  lineHeight: '60px',
  textAlign: 'center',
  borderTop: `1px solid ${vars.color.gray1}`,
  marginTop: '15px',
});
