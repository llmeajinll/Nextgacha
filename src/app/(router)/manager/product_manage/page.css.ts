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

export { tab, tabOn, tabCount } from '@/styles/ui.css';

export { searchField as search, searchFieldInput as searchInput } from '@/styles/variants.css';

export const saved = style({
  padding: '10px 14px',
  backgroundColor: vars.color.blueBg,
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
