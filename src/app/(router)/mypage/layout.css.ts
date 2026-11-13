import { style } from '@vanilla-extract/css';
import { mobile } from '@/styles/ui.css';

export const wrapper = style({
  boxSizing: 'border-box',
  // 아래 여백은 디자인 캔버스 MyCart(웹 80px) / MyCartMobile(24px) 기준
  padding: '32px 20px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  '@media': { [mobile]: { padding: '16px 16px 24px', gap: 16 } },
});
