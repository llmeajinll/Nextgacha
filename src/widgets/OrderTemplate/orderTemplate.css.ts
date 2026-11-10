import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const pixel = 'silkscreen';
const danger = '#A3262A';

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: vars.slate[800] });

// ── 상태 탭 (상품 확인중 → 배송중 → 배송 완료 | 환불) ──
export const tabs = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 });

export const tab = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  fontSize: 14,
  color: vars.slate[800],
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

export const tabOn = style({
  borderColor: vars.color.blue1,
  backgroundColor: vars.color.blue1,
  color: 'white',
  fontWeight: 600,
});

export const tabCount = style({
  minWidth: 22,
  height: 22,
  boxSizing: 'border-box',
  padding: '0 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: pixel,
  fontSize: 12,
  backgroundColor: vars.slate[100],
  color: vars.slate[600],
});

globalStyle(`${tabOn} ${tabCount}`, { backgroundColor: 'white', color: vars.ink[500] });

export const tabArrow = style({ width: 16, height: 16, fill: vars.slate[400] });

export const tabGap = style({ width: 1, height: 28, margin: '0 8px', backgroundColor: vars.slate[200] });

export const toast = style({ padding: '10px 14px', backgroundColor: '#DDF0FD', color: vars.ink[700], fontSize: 14 });

// ── 일괄 처리 ──
export const bulk = style({ display: 'flex', flexDirection: 'column', border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white' });

export const bulkRow = style({
  minHeight: 60,
  boxSizing: 'border-box',
  padding: '8px 12px 8px 16px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const selectAll = style({
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
});

export { checkbox as checkInput } from '@/styles/variants.css';

export const muted = style({ fontSize: 13, fontWeight: 400, color: vars.slate[600] });

const btn = style({
  height: 44,
  padding: '0 18px',
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
});

export const primaryBtn = style([
  btn,
  {
    border: `1px solid ${vars.color.blue1}`,
    backgroundColor: vars.color.blue1,
    color: 'white',
    selectors: { '&:disabled': { opacity: 0.6, cursor: 'default' } },
  },
]);

export const bulkBtn = style([
  primaryBtn,
  {
    selectors: {
      '&:disabled': { opacity: 1, borderColor: vars.slate[200], backgroundColor: vars.slate[100], color: vars.slate[500] },
    },
  },
]);

export const ghostBtn = style([
  btn,
  {
    padding: '0 16px',
    border: `1px solid ${vars.slate[200]}`,
    backgroundColor: 'white',
    color: vars.slate[800],
    selectors: { '&:hover': { backgroundColor: vars.slate[100] } },
  },
]);

export const bulkError = style({
  margin: 0,
  padding: '10px 16px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: '#FFF5F5',
  fontSize: 14,
  color: danger,
});

export const confirm = style({
  padding: '10px 12px 10px 16px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  fontSize: 14,
});

export const confirmBtns = style({ display: 'flex', gap: 8 });

// ── 목록 ──
export const list = style({ display: 'flex', flexDirection: 'column', gap: 16 });

export const empty = style({
  padding: '56px 20px',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textAlign: 'center',
});

export const emptyTitle = style({ fontSize: 15, fontWeight: 500 });

// theme의 globalStyle('div', { color })가 상속을 끊으므로 컨테이너 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
