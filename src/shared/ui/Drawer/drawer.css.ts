import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind } from '@/styles/ui.css';

const slide = keyframes({ from: { transform: 'translateX(100%)' }, to: { transform: 'none' } });

// 관리자 헤더(60px) 아래부터 화면 끝까지
export const drawer = style({
  position: 'fixed',
  top: 60,
  right: 0,
  bottom: 0,
  zIndex: 900,
  width: 420,
  maxWidth: '100%',
  boxSizing: 'border-box',
  borderLeft: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  boxShadow: '-8px 0 0 0 rgba(42, 58, 71, 0.06)',
  overflowY: 'auto',
  color: vars.slate[800],
  animation: `${slide} .25s ease`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

export const head = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  height: 56,
  boxSizing: 'border-box',
  padding: '0 8px 0 20px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const title = style({ fontFamily: 'silkscreen', fontSize: 14, letterSpacing: -0.5, color: vars.color.blue1 });

export const close = style([btn, btnIcon, btnKind.ghost]);

export const body = style({ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 });

// theme의 globalStyle('div', { color })가 상속을 끊으므로 안쪽 div는 부모 색을 따르게
globalStyle(`${drawer} div`, { color: 'inherit' });
