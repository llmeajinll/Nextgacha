import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile, utabs } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate } = vars;

export const pageWrap = style({
  maxWidth: 1120,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: '48px 24px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  '@media': { [mobile]: { padding: '24px 16px 48px', gap: 20 } },
});

export const head = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 20,
  '@media': { [mobile]: { flexDirection: 'column', alignItems: 'stretch', gap: 16 } },
});

export const eyebrow = style({ display: 'block', marginBottom: 8, fontFamily: 'silkscreen', fontSize: 14, letterSpacing: -0.6, color: color.blue1, '@media': { [mobile]: { fontSize: fluid(11) } } });

export const heading = style({
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: -1.6,
  lineHeight: '120%',
  '@media': { [mobile]: { fontSize: fluid(20), letterSpacing: -1.2 } },
});

export const searchBox = style({
  flex: '0 1 320px',
  minWidth: 220,
  height: 48,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 14px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  color: slate[500],
  selectors: {
    '&:focus-within': { borderColor: color.blue1, boxShadow: `3px 3px 0 0 ${color.blueLight}` },
  },
  '@media': { [mobile]: { flex: 'none', width: '100%' } },
});

export const searchInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: '100%',
  border: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  font: 'inherit',
  fontSize: 15,
  color: slate[800],
});

export const pinnedGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 12,
  '@media': { [mobile]: { gridTemplateColumns: '1fr', gap: 8 } },
});

// 분류가 많아지면 옆으로 밀어서 본다
export const tabs = style([
  utabs,
  {
    overflowX: 'auto',
    scrollbarWidth: 'none',
    selectors: { '&::-webkit-scrollbar': { display: 'none' } },
    '@media': { [mobile]: { margin: '0 -16px', padding: '0 16px' } },
  },
]);

export const list = style({ display: 'flex', flexDirection: 'column', '@media': { [mobile]: { marginTop: -8 } } });

export const empty = style({
  padding: '60px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  fontSize: 15,
  color: slate[600],
  '@media': { [mobile]: { fontSize: fluid(13) } },
});

export const emptyTitle = style({ fontFamily: 'silkscreen', fontSize: 20, color: slate[300], '@media': { [mobile]: { fontSize: fluid(16) } } });

export const paginationWrap = style({ margin: 0 });
