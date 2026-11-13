import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const { color, slate } = vars;
const pixel = 'silkscreen';

// 쇼핑몰 헤더: 안쪽 1120px 가운데 정렬. 카테고리 메뉴는 이 컨테이너 폭으로 펼쳐진다
export const headerContainer = style({ position: 'relative', width: '100%' });

export const bar = style({
  position: 'relative',
  zIndex: 6,
  borderBottom: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
});

export const menuContainer = style({
  maxWidth: 1120,
  margin: '0 auto',
  height: 72,
  boxSizing: 'border-box',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 40,
});

// ── 로고: 올려놓으면 글자가 차례로 튄다 ──
const wave = keyframes({
  '0%': { transform: 'translateY(0)' },
  '40%': { transform: 'translateY(-6px)' },
  '70%, 100%': { transform: 'translateY(-2px)' },
});

export const logo = style({
  display: 'inline-flex',
  padding: '4px 0',
  fontFamily: pixel,
  fontSize: 28,
  letterSpacing: -1.4,
  lineHeight: 1,
  color: color.blue1,
});
globalStyle(`${logo} span`, { display: 'inline-block', textShadow: `0 0 0 ${color.blue2}`, transition: 'text-shadow .2s steps(2)' });
globalStyle(`${logo}:hover span, ${logo}:focus-visible span`, {
  animation: `${wave} .54s steps(3) both`,
  textShadow: `3px 3px 0 ${color.blue2}`,
});
globalStyle(`${logo}:hover span, ${logo}:focus-visible span`, {
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none', transform: 'translateY(-2px)' } },
});
for (let i = 0; i < 9; i++) globalStyle(`${logo} span:nth-child(${i + 1})`, { animationDelay: `${i * 60}ms` });

// ── 메뉴 ──
export const nav = style({ display: 'flex', alignItems: 'stretch', alignSelf: 'stretch', gap: 28 });

export const menu = style({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  fontFamily: pixel,
  fontSize: 16,
  letterSpacing: -0.6,
  color: slate[500],
  cursor: 'pointer',
  transition: 'color .12s ease, box-shadow .12s ease',
  selectors: {
    '&:hover': { color: slate[800] },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
});

// 지금 보고 있는 메뉴, 카테고리 메뉴가 열려 있을 때 CATEGORY
export const activeMenu = style({
  color: color.blue1,
  boxShadow: `inset 0 -3px 0 0 ${color.blue1}`,
  selectors: { '&:hover': { color: color.blue1 } },
});
export const openMenu = style({ color: color.blue1, selectors: { '&:hover': { color: color.blue1 } } });

export const tools = style({
  flex: '1 1 auto',
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 24,
});

// 카테고리 메뉴가 열리면 아래 페이지를 흐리게
export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.65)',
  pointerEvents: 'none',
});

