import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind } from '@/styles/ui.css';
import { searchField } from '@/styles/variants.css';

const pixel = 'silkscreen';
const { slate, color, tone } = vars;

// 막대 길이 (assignInlineVars로 넣음)
export const barWidth = createVar();

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: slate[800] });

export const muted = style({ margin: 0, fontSize: 13, color: slate[600] });

// ── 요약 ──
export const summary = style({ display: 'flex', flexWrap: 'wrap', gap: 16 });

const box = { border: `1px solid ${slate[200]}`, backgroundColor: 'white', padding: 20 } as const;

export const avgBox = style({ ...box, flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: 24 });

export const avgText = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const avgNum = style({ fontFamily: pixel, fontSize: 40, letterSpacing: -2, lineHeight: 1 });

export const dist = style({ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 4 });

export const distRow = style({
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr) 28px',
  alignItems: 'center',
  gap: 8,
  minHeight: 24,
  padding: '0 4px',
  border: 0,
  backgroundColor: 'transparent',
  font: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: slate[50] },
    '&[aria-pressed="true"]': { backgroundColor: color.blueTint2 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 0 },
  },
});

export const distN = style({ fontFamily: pixel, fontSize: 12, color: slate[700], textAlign: 'left' });

export const distTrack = style({ display: 'block', height: 10, backgroundColor: slate[100] });

const fill = style({ display: 'block', height: '100%', width: barWidth });
export const distFill = style([fill, { backgroundColor: color.blue1 }]);
export const distFillLow = style([fill, { backgroundColor: tone.danger[1] }]);

export const distCount = style({ fontSize: 12, color: slate[600], textAlign: 'right' });

export const tile = style({ ...box, flex: '1 1 160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 });

export const tileNum = style({ fontFamily: pixel, fontSize: 30, letterSpacing: -1.5, lineHeight: 1 });

export const tileUnit = style({ marginLeft: 4, fontFamily: 'inherit', fontSize: 15, letterSpacing: 0 });

// ── 별 ──
export const stars = style({ display: 'flex', gap: 2 });

export const star = styleVariants({
  on: { fill: color.blue1 },
  off: { fill: slate[200] },
  low: { fill: tone.danger[1] },
  lowOff: { fill: tone.danger.bg },
});

// ── 보기 탭 · 도구 ──
export { utabs, utab, tab } from '@/styles/ui.css';

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 });

export const search = style([searchField, { flex: '0 1 320px', minWidth: 200 }]);

export { searchFieldInput as searchInput } from '@/styles/variants.css';

// DropDown 바깥 div 폭
export const productDrop = style({ flex: '0 1 260px', minWidth: 180 });

export const sortDrop = style({ flex: '0 0 190px', width: 190 });

export const pushRight = style({ marginLeft: 'auto' });

// ── 상품별 ──
export const groups = style({ display: 'flex', flexDirection: 'column', gap: 12 });

export const group = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const groupHead = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'grid',
  gridTemplateColumns: '52px minmax(0, 1fr) 132px 140px 96px 24px',
  alignItems: 'center',
  gap: 14,
  padding: '12px 16px',
  border: 0,
  backgroundColor: 'transparent',
  font: 'inherit',
  textAlign: 'left',
  color: slate[800],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: slate[25] },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
  '@media': { 'screen and (max-width: 760px)': { gridTemplateColumns: '52px minmax(0, 1fr) 24px' } },
});

// 상품 관리 목록 썸네일과 같은 모양
export const groupThumb = style({
  width: 52,
  height: 52,
  boxSizing: 'border-box',
  border: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  objectFit: 'cover',
});

export const groupText = style({ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 });

export const groupName = style({ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

const wide = { '@media': { 'screen and (max-width: 760px)': { display: 'none' } } };

export const groupAvg = style({ display: 'flex', alignItems: 'center', gap: 8, ...wide });

export const groupAvgNum = style({ fontFamily: pixel, fontSize: 20, letterSpacing: -1 });

export const mix = style({ display: 'flex', height: 10, backgroundColor: slate[100], ...wide });

const seg = style({ display: 'block', width: barWidth });
export const mixGood = style([seg, { backgroundColor: color.blue1 }]);
export const mixMid = style([seg, { backgroundColor: slate[300] }]);
export const mixLow = style([seg, { backgroundColor: tone.danger[1] }]);

const lowBase = style({ justifySelf: 'end', fontSize: 12, fontWeight: 600, padding: '3px 6px', whiteSpace: 'nowrap', ...wide });
export const lowTag = style([lowBase, { backgroundColor: tone.danger.bg, color: tone.danger[1] }]);
export const noLowTag = style([lowBase, { backgroundColor: slate[100], color: slate[600] }]);

export const chev = style({ width: 24, height: 24, fill: slate[500], transition: 'transform .15s ease' });
export const chevOpen = style([chev, { transform: 'rotate(180deg)' }]);

export const groupBody = style({
  padding: 16,
  borderTop: `1px solid ${slate[100]}`,
  backgroundColor: slate[50],
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

export const options = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const pixelLabel = style({ fontFamily: pixel, fontSize: 12, color: slate[600] });

export const chips = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { chip, chipCount } from '@/styles/ui.css';

export const chipSub = style({ fontSize: 12, fontWeight: 400 });

export const cards = style({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 });

export const groupFoot = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 });

export const pager = style({ display: 'flex', alignItems: 'center', gap: 6 });

export const iconBtn = style([btn, btnIcon, btnKind.neutral]);

export const pageText = style({ minWidth: 56, textAlign: 'center', fontFamily: pixel, fontSize: 13, color: slate[700] });

// ── 리뷰 카드 ──
export const feed = style({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 });

export const card = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white', display: 'flex', flexDirection: 'column' });

export const cardBody = style({ padding: '14px 16px 10px', display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto' });

export const cardHead = style({ display: 'flex', alignItems: 'center', gap: 8 });

export const rateNum = style({ fontFamily: pixel, fontSize: 13 });

export const date = style({ marginLeft: 'auto', fontSize: 13, color: slate[600] });

export const optionLine = style({ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, fontSize: 13, color: slate[600] });

export const optionTag = style({
  flex: '0 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 12,
  padding: '2px 6px',
  border: `1px solid ${slate[200]}`,
  color: slate[700],
});

export const ellipsis = style({ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const content = style({ margin: 0, fontSize: 14, lineHeight: '160%', whiteSpace: 'pre-line', overflowWrap: 'anywhere' });

export const cardFoot = style({
  padding: '0 16px',
  minHeight: 44,
  borderTop: `1px solid ${slate[100]}`,
  display: 'flex',
  alignItems: 'center',
  fontSize: 13,
  color: slate[700],
});

export const empty = style({
  padding: '48px 20px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const emptyPixel = style({ fontFamily: pixel, fontSize: 20, color: slate[500] });

// theme의 globalStyle('div', { color })가 상속을 끊으므로 안쪽 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
