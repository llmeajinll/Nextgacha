import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind } from '@/styles/ui.css';

const danger = vars.tone.danger[1];

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: vars.slate[800] });

// ── 주문번호 검색 (모양은 상품 관리 검색과 같음) ──
export { searchField as search, searchFieldInput as searchInput } from '@/styles/variants.css';

export const searchRow = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 });

// ── 상태 탭 (상품 확인중 → 배송중 → 배송 완료 | 환불) ──
export const tabs = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 });

export const tabArrow = style({ width: 16, height: 16, fill: vars.slate[400] });

export const tabGap = style({ width: 1, height: 28, margin: '0 8px', backgroundColor: vars.slate[200] });

export const toast = style({ padding: '10px 14px', backgroundColor: vars.color.blueBg, color: vars.ink[700], fontSize: 14 });

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

export const primaryBtn = style([btn, btnKind.primary]);

export const bulkBtn = primaryBtn;

export const ghostBtn = style([btn, btnKind.neutral]);

export const bulkError = style({
  margin: 0,
  padding: '10px 16px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.tone.danger.bg,
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
