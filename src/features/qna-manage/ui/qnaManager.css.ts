import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnPx, btnSize, tag, tagTone } from '@/styles/ui.css';
import { searchField } from '@/styles/variants.css';

const pixel = 'silkscreen';
const { slate, color, tone } = vars;

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: slate[800] });

export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 });

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { tab, tabCount } from '@/styles/ui.css';

export { searchFieldInput as searchInput } from '@/styles/variants.css';
export const search = style([searchField, { flex: '1 1 260px' }]);

export const toast = style({ padding: '10px 14px', backgroundColor: color.blueBg, color: vars.ink[700], fontSize: 14 });

export const layout = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 20 });

// ── 목록 ──
export const list = style({ flex: '1 1 380px', minWidth: 0, border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const row = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '14px 16px',
  border: 0,
  borderBottom: `1px solid ${slate[100]}`,
  backgroundColor: 'white',
  font: 'inherit',
  textAlign: 'left',
  color: slate[800],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: slate[50] },
    '&[aria-pressed="true"]': { backgroundColor: color.blueTint2, boxShadow: `inset 4px 0 0 0 ${color.blue1}` },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
});

export const rowTop = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 });

export const waitTag = style([tag, tagTone.warning, { fontWeight: 500, padding: '3px 6px' }]);
export const doneTag = style([tag, tagTone.info, { fontWeight: 500, padding: '3px 6px' }]);

export const lock = style({ width: 16, height: 16, fill: slate[400] });

export const late = style({ fontSize: 12, fontWeight: 600, color: tone.danger[1] });

export const rowDate = style({ marginLeft: 'auto', fontSize: 13, fontWeight: 400, color: slate[600] });

export const rowTitle = style({ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const rowSub = style({ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0, fontSize: 13, color: slate[600] });

export const rowWriter = style({ flex: '0 0 auto' });

export const ellipsis = style({ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const empty = style({ padding: '48px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 });

export const emptyPixel = style({ fontFamily: pixel, fontSize: 20, color: slate[500] });

export const muted = style({ fontSize: 13, color: slate[600] });

// ── 상세 ──
export const detail = style({ flex: '1.4 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 });

export const noPick = style({
  padding: '48px 20px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  textAlign: 'center',
  fontSize: 14,
  color: slate[600],
});

export const card = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const productHead = style({
  padding: '14px 20px',
  borderBottom: `1px solid ${slate[100]}`,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

export const productIcon = style({
  width: 48,
  height: 48,
  flex: '0 0 48px',
  boxSizing: 'border-box',
  border: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  color: slate[400],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${productIcon} svg`, { fill: 'currentColor' });

export const productText = style({ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 });

export const pixelLabel = style({ fontFamily: pixel, fontSize: 12, color: slate[500] });

export const productName = style({ fontSize: 15, fontWeight: 500 });

export const message = style({ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 });

export const messageHead = style({ display: 'flex', alignItems: 'center', gap: 8 });

const mark = style({
  width: 28,
  height: 28,
  flex: '0 0 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: pixel,
  fontSize: 14,
});

export const qMark = style([mark, { backgroundColor: tone.warning.bg, color: tone.warning[1] }]);
export const aMark = style([mark, { backgroundColor: color.blue1, color: 'white' }]);

export const messageTitle = style({ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.6 });

export const messageBody = style({
  margin: 0,
  paddingLeft: 36,
  fontSize: 15,
  lineHeight: '160%',
  whiteSpace: 'pre-line',
  overflowWrap: 'anywhere',
});

export const messageMeta = style({ paddingLeft: 36, fontSize: 13, color: slate[600] });

export const answerCard = style({
  border: `1px solid ${color.blueLight}`,
  backgroundColor: 'white',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const answerTitle = style({ fontSize: 15, fontWeight: 600 });

export const answerFoot = style({ display: 'flex', justifyContent: 'flex-end' });

// 답변 수정 · 자주 쓰는 답변
export const smallBtn = style([btn, btnSize.s, btnKind.neutral]);

// ── 답변 쓰기 ──
export const form = style({
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const formHead = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 });

export const formTitle = style({ fontSize: 15, fontWeight: 600 });

export const templates = style({ display: 'flex', flexDirection: 'column', gap: 6 });

export const hint = style({ fontSize: 12, color: slate[600] });

export const templateBtns = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export const textarea = style({
  boxSizing: 'border-box',
  width: '100%',
  padding: 12,
  border: `1px solid ${slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 15,
  lineHeight: '160%',
  color: slate[800],
  backgroundColor: 'white',
  resize: 'vertical',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  selectors: {
    '&:focus': { outline: 'none', borderColor: color.blue1, boxShadow: `3px 3px 0 0 ${color.blueLight}` },
    '&::placeholder': { color: slate[500] },
  },
});


export const inputError = style({ borderColor: tone.danger[1] });

export const errorText = style({ fontSize: 13, color: tone.danger[1] });

export const formFoot = style({ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10 });

export const cancelBtn = style([btn, btnSize.l, btnPx, btnKind.neutral, { width: 140 }]);
export const answerBtn = style([btn, btnSize.l, btnPx, btnKind.primary, { width: 180 }]);

// theme의 globalStyle('div', { color })가 상속을 끊으므로 안쪽 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
