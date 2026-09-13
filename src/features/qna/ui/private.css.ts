import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
export const privateContainer = style({
  border: `1px solid ${vars.color.gray1}`,
  padding: '8px 10px',
  boxSizing: 'border-box',
});
