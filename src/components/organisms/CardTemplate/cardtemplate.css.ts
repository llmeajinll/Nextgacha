import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cardTemplateContainer = style({
  //   width: '1274px',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '35px 22px',
  margin: '0 auto',
});
