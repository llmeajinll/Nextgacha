import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { tag, tagTone } from '@/styles/ui.css';
import { searchField } from '@/styles/variants.css';

const pixel = 'silkscreen';
const { slate, color, tone } = vars;

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: slate[800] });

export const muted = style({ margin: 0, fontSize: 13, color: slate[600] });

// ── 요약 ──
export const tiles = style({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 });

export const tile = style({
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const tileNum = style({ fontFamily: pixel, fontSize: 30, letterSpacing: -1.5, lineHeight: 1 });

export const tileUnit = style({ marginLeft: 4, fontFamily: 'inherit', fontSize: 15, letterSpacing: 0 });

// ── 도구 ──
export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 });

export const search = style([searchField, { flex: '1 1 280px', minWidth: 0 }]);

export { searchFieldInput as searchInput } from '@/styles/variants.css';

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { tab, tabCount } from '@/styles/ui.css';

// DropDown 바깥 div 폭
export const sortDrop = style({ flex: '0 0 200px', width: 200 });

// ── 목록 ──
export const panel = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const scroll = style({ overflowX: 'auto' });

export const table = style({ minWidth: 560 });

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 104px 80px 130px 110px',
  gap: 10,
  alignItems: 'center',
  padding: '0 16px',
});

export const head = style({
  height: 40,
  borderBottom: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  fontSize: 13,
  fontWeight: 500,
  color: slate[600],
});

export const row = style({
  width: '100%',
  minHeight: 64,
  boxSizing: 'border-box',
  border: 0,
  borderBottom: `1px solid ${slate[100]}`,
  backgroundColor: 'white',
  font: 'inherit',
  fontSize: 14,
  textAlign: 'left',
  color: slate[800],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: slate[50] },
    '&[aria-pressed="true"]': { backgroundColor: color.blueTint2, boxShadow: `inset 4px 0 0 0 ${color.blue1}` },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
});

export const center = style({ textAlign: 'center' });

export const who = style({ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 });

export const nickname = style({ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 500 });

const badge = style({ fontFamily: pixel, fontSize: 11, fontWeight: 400, padding: '2px 6px' });
export const adminBadge = style([badge, { backgroundColor: color.blueBg, color: color.blue1 }]);
export const newBadge = style([badge, { backgroundColor: tone.warning.bg, color: tone.warning[1] }]);

export const email = style({ fontSize: 13, color: slate[600], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflowWrap: 'anywhere' });

export const empty = style({ padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' });

export const emptyTitle = style({ fontSize: 15, fontWeight: 500 });

export const foot = style({
  minHeight: 60,
  boxSizing: 'border-box',
  padding: '8px 14px',
  borderTop: `1px solid ${slate[200]}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

// ── 상세 패널 ──
export const card = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const profile = style({
  padding: '18px 20px',
  borderBottom: `1px solid ${slate[100]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const profileName = style({ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, letterSpacing: -0.6 });

export const stats = style({ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderBottom: `1px solid ${slate[100]}` });

export const stat = style({
  padding: '14px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  selectors: { '& + &': { borderLeft: `1px solid ${slate[100]}` } },
});

export const statNum = style({ fontSize: 18, fontWeight: 600 });

export const statPoint = style([statNum, { color: color.blue1 }]);

export const info = style({
  margin: 0,
  padding: '16px 20px',
  display: 'grid',
  gridTemplateColumns: '72px minmax(0, 1fr)',
  gap: '8px 12px',
  fontSize: 14,
});

globalStyle(`${info} dt`, { color: slate[600] });
globalStyle(`${info} dd`, { margin: 0, lineHeight: '150%', overflowWrap: 'anywhere' });

export const errorText = style({ margin: 0, fontSize: 14, color: tone.danger[1] });

export const section = style({
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const sectionHead = style({ display: 'flex', flexDirection: 'column', gap: 4 });

export const sectionTitle = style({ margin: 0, fontSize: 16, fontWeight: 600 });

// 칸 게이지 (디자인 "상태 바 정리 · 칸 게이지")
export const keepRow = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' });

export const keepTitle = style({ flex: '1 1 180px', minWidth: 0, fontSize: 14 });

export const cells = style({ display: 'flex', gap: 3 });

const cellBase = style({ width: 14, height: 14, boxSizing: 'border-box', border: '1px solid' });
export const cell = styleVariants({
  on: [cellBase, { backgroundColor: tone.info[1], borderColor: tone.info[2] }],
  off: [cellBase, { backgroundColor: slate[50], borderColor: slate[200] }],
  full: [cellBase, { backgroundColor: tone.danger[1], borderColor: tone.danger[2] }],
  fullOff: [cellBase, { backgroundColor: tone.danger.bg, borderColor: tone.danger.bg }],
});

export const keepCount = style({ fontFamily: pixel, fontSize: 12, color: slate[700] });
export const keepFull = style([keepCount, { color: tone.danger[1] }]);

export const orderRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '10px 12px',
  border: `1px solid ${slate[100]}`,
  textDecoration: 'none',
  selectors: {
    '&:hover': { borderColor: color.blue1, backgroundColor: color.blueTint2 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
});

export const orderTop = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 });

export const orderId = style({ fontFamily: pixel, fontSize: 12, letterSpacing: -0.4, overflowWrap: 'anywhere' });

export const orderSub = style({ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, color: slate[600] });

// 주문 상태 태그 (주문 관리와 같은 색)
export const statusTag = styleVariants({
  '상품 확인중': [tag, tagTone.warning],
  배송중: [tag, tagTone.info],
  '배송 완료': [tag, tagTone.success],
  환불: [tag, tagTone.danger],
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 안쪽 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
