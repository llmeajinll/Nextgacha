import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 관리자 화면은 쇼핑몰 1314px 컨테이너 없이 항상 전체 폭
export const page = style({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.slate[50],
});

export const body = style({
  flex: 1,
  display: 'flex',
});

export const main = style({
  flex: 1,
  minWidth: 0,
  boxSizing: 'border-box',
  padding: '32px 40px 50px',
});
