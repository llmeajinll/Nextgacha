import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const pixel = 'silkscreen';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  color: vars.slate[800],
});

export const titleSection = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 16,
  paddingBottom: 20,
  borderBottom: `1px solid ${vars.slate[200]}`,
});

export const titleText = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const eyebrow = style({
  fontFamily: pixel,
  fontSize: 14,
  letterSpacing: -0.7,
  color: vars.color.blue1,
});

export const title = style({
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: -1.4,
  lineHeight: '120%',
});

export const subText = style({
  margin: 0,
  fontSize: 15,
  letterSpacing: -0.5,
  color: vars.slate[600],
});

// ── 상태 탭 + 검색 ──
export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export const tab = style({
  height: 40,
  boxSizing: 'border-box',
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  font: 'inherit',
  fontSize: 14,
  color: vars.slate[800],
  cursor: 'pointer',
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

export const tabOn = style({
  borderColor: vars.color.blue1,
  backgroundColor: vars.color.blue1,
  color: 'white',
  fontWeight: 600,
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

export const tabCount = style({ fontFamily: pixel, fontSize: 12, opacity: 0.8 });

export const search = style({
  flex: '0 1 340px',
  minWidth: 220,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 0 0 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  color: vars.slate[500],
  selectors: {
    '&:focus-within': { borderColor: vars.color.blue1, boxShadow: '3px 3px 0 0 #BFE3FF' },
  },
});

globalStyle(`${search} svg`, { width: 20, height: 20, fill: 'currentColor', flex: '0 0 auto' });

export const searchInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: 42,
  padding: '0 12px 0 0',
  border: 0,
  outline: 'none',
  font: 'inherit',
  fontSize: 15,
  color: vars.slate[800],
  backgroundColor: 'transparent',
  selectors: { '&::placeholder': { color: vars.slate[500] } },
});

export const saved = style({
  padding: '10px 14px',
  backgroundColor: '#DDF0FD',
  color: vars.ink[700],
  fontSize: 14,
});

// ── 목록 ──
export const panel = style({
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
});

export const panelHead = style({
  height: 52,
  boxSizing: 'border-box',
  padding: '0 20px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

export const panelTitle = style({ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.8 });

export const panelCount = style({ fontSize: 14, color: vars.slate[600] });

// 좁은 화면에서는 목록만 가로 스크롤
export const scroll = style({ overflowX: 'auto' });

export const table = style({ minWidth: 820 });

export const empty = style({
  padding: '48px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textAlign: 'center',
  fontSize: 13,
  color: vars.slate[600],
});

export const emptyTitle = style({ fontSize: 15, fontWeight: 500, color: vars.slate[800] });

// theme의 globalStyle('div', { color })가 상속을 끊으므로 컨테이너 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
