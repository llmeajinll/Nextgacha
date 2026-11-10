import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const pixel = 'silkscreen';
const danger = '#A3262A';
const tint = '#DDF0FD';

// 헤더와 행이 같은 칸 너비를 쓴다
export const rowGrid = style({
  display: 'grid',
  gridTemplateColumns: '44px minmax(260px, 1fr) 92px 64px 64px 100px 76px 72px',
  alignItems: 'center',
  gap: 12,
  padding: '10px 20px',
});

export const head = style({
  borderBottom: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.slate[50],
  fontFamily: pixel,
  fontSize: 12,
  color: vars.slate[600],
});

export const row = style({
  borderBottom: `1px solid ${vars.slate[100]}`,
  backgroundColor: 'white',
  color: vars.slate[800],
});

export const rowEditing = style({ backgroundColor: vars.slate[50] });

export const rowMain = style({ minHeight: 76, boxSizing: 'border-box', padding: '12px 20px' });

export const right = style({ textAlign: 'right' });

export const center = style({ display: 'flex', justifyContent: 'center' });

export const num = style({ fontFamily: pixel, fontSize: 13, color: vars.slate[500] });

export const product = style({ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 });

export const thumb = style({
  width: 52,
  height: 52,
  flex: '0 0 52px',
  boxSizing: 'border-box',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  objectFit: 'cover',
});

export const productText = style({ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 });

export const title = style({
  fontSize: 15,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tags = style({ display: 'flex', flexWrap: 'wrap', gap: 4 });

export const disc = style({ fontSize: 14, color: vars.ink[500] });

export const muted = style({ fontSize: 14, color: vars.slate[400] });

export const sub = style({ fontSize: 14, color: vars.slate[600] });

export const stock = style({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 });

export const zero = style({ fontSize: 12, color: danger });

export const editBtn = style({
  height: 44,
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  color: vars.slate[800],
  cursor: 'pointer',
  selectors: { '&:hover': { backgroundColor: vars.slate[100] } },
});

export const editBtnOn = style({ borderColor: vars.ink[400], color: vars.ink[400] });

// ── 편집 영역 ──
export const editor = style({
  margin: '0 20px 20px',
  border: '1px solid #BFE3FF',
  backgroundColor: 'white',
});

export const editorHead = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 16px',
  borderBottom: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const editorKind = style({ fontFamily: pixel, fontSize: 13, color: vars.ink[400] });

export const editorTitle = style({ fontSize: 14, fontWeight: 600 });

export const editorBody = style({ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 });

export const priceGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 16,
});

export const field = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const label = style({ fontSize: 14, fontWeight: 500 });

export const required = style({ color: danger });

export const hint = style({ fontSize: 13, fontWeight: 400, color: vars.slate[600] });

export const input = style({
  width: '100%',
  minWidth: 0,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 15,
  color: vars.slate[800],
  backgroundColor: 'white',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  selectors: {
    '&:focus': { outline: 'none', borderColor: vars.color.blue1, boxShadow: '3px 3px 0 0 #BFE3FF' },
    '&::placeholder': { color: vars.slate[500] },
  },
});

export const inputError = style({ borderColor: danger });

export const zeroInput = style({ color: danger });

export const unitRow = style({ display: 'flex' });

export const unit = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  borderLeft: 0,
  backgroundColor: vars.slate[100],
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  color: vars.slate[600],
});

export const salePrice = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  backgroundColor: tint,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  fontWeight: 600,
  color: vars.ink[600],
});

export const saleUnit = style({ fontSize: 14, fontWeight: 400 });

export const options = style({ display: 'flex', flexDirection: 'column', gap: 10 });

export const optionsHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const optionRow = style({ display: 'flex', alignItems: 'center', gap: 10 });

export const optionNo = style({
  width: 36,
  height: 36,
  flex: '0 0 36px',
  backgroundColor: tint,
  color: vars.ink[500],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: pixel,
  fontSize: 13,
});

export const optionQty = style({ width: 140, flex: '0 0 140px' });

export const optionError = style({ paddingLeft: 46 });

export const errorText = style({ fontSize: 13, color: danger });

// ImgBtn 크기·테두리만
export const iconBtn = style({
  width: 44,
  height: 44,
  flex: '0 0 44px',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  color: vars.slate[600],
  selectors: { '&:hover:not(:disabled)': { backgroundColor: vars.slate[100] } },
});

export const slotBtn = style({
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  border: '2px dashed #BFE3FF',
  backgroundColor: vars.slate[50],
  color: vars.ink[400],
  font: 'inherit',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

globalStyle(`${slotBtn} svg`, { width: 24, height: 24, fill: 'currentColor' });

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 10,
  paddingTop: 12,
  borderTop: `1px solid ${vars.slate[100]}`,
});

export const formError = style({
  marginRight: 'auto',
  padding: '10px 12px',
  fontSize: 14,
  color: danger,
  backgroundColor: '#FFE3E3',
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 행 안 div는 부모 색을 따르게
globalStyle(`${row} div`, { color: 'inherit' });
