import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const pixel = 'silkscreen';
const danger = '#A3262A';

export const card = style({
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  color: vars.slate[800],
});

export const cardChecked = style({ borderColor: vars.color.blue1 });

export const head = style({
  minHeight: 56,
  boxSizing: 'border-box',
  padding: '6px 20px 6px 12px',
  borderBottom: `1px solid ${vars.slate[100]}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px 14px',
});

export const checkBox = style({
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export { checkbox as checkInput } from '@/styles/variants.css';

export const headGap = style({ width: 8 });

export const orderId = style({ fontFamily: pixel, fontSize: 14, letterSpacing: -0.5 });

export const muted = style({ fontSize: 13, color: vars.slate[600] });

export const status = style({ fontSize: 12, fontWeight: 600, padding: '4px 8px' });

export const statusTone = styleVariants({
  '상품 확인중': { backgroundColor: '#FFF1D6', color: '#7A4B00' },
  배송중: { backgroundColor: '#DDF0FD', color: vars.ink[600] },
  '배송 완료': { backgroundColor: vars.slate[100], color: vars.slate[700] },
  환불: { backgroundColor: '#FFE3E3', color: danger },
});

export const total = style({ marginLeft: 'auto', fontSize: 18, fontWeight: 600, letterSpacing: -0.6 });

export const totalUnit = style({ fontSize: 14, fontWeight: 400 });

export const body = style({
  padding: '16px 20px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px 32px',
});

export const items = style({ display: 'flex', flexDirection: 'column', gap: 12 });

export const pixelLabel = style({ fontFamily: pixel, fontSize: 12, color: vars.slate[600] });

export const item = style({ display: 'flex', flexDirection: 'column', gap: 6 });

export const itemTitle = style({ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 15, fontWeight: 500 });

export const itemNum = style({
  fontFamily: pixel,
  fontSize: 12,
  padding: '2px 6px',
  backgroundColor: '#DDF0FD',
  color: vars.ink[500],
});

export const options = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export const option = style({
  height: 28,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  border: `1px solid ${vars.slate[200]}`,
  fontSize: 13,
  color: vars.slate[700],
});

export const optionCount = style({ fontWeight: 600, color: vars.slate[800] });

export const info = style({
  margin: 0,
  display: 'grid',
  gridTemplateColumns: '72px minmax(0, 1fr)',
  gap: '8px 12px',
  alignContent: 'start',
  fontSize: 14,
});

globalStyle(`${info} dt`, { color: vars.slate[600] });
globalStyle(`${info} dd`, { margin: 0, lineHeight: '150%' });

export const wrap = style({ overflowWrap: 'anywhere' });

// ── 상태별 하단 ──
export const foot = style({
  padding: '14px 20px 16px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 14,
});

export const footRow = style({
  padding: '12px 20px',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '6px 20px',
});

export const footRefund = style({ display: 'block', backgroundColor: '#FFF5F5', lineHeight: '150%' });

export const refundLabel = style({ color: danger, fontWeight: 600 });

export const shipRow = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 });

export const field = style({ display: 'flex', flexDirection: 'column', gap: 6 });

export const courierField = style({ flex: '0 1 200px', minWidth: 160 });

export const invoiceField = style({ flex: '1 1 220px', minWidth: 180 });

export const label = style({ fontSize: 13, fontWeight: 500 });

export const hint = style({ fontSize: 12, color: vars.slate[600] });

export const input = style({
  width: '100%',
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 15,
  color: vars.slate[800],
  backgroundColor: 'white',
  selectors: {
    '&:focus': { outline: 'none', borderColor: vars.color.blue1, boxShadow: '3px 3px 0 0 #BFE3FF' },
    '&::placeholder': { color: vars.slate[500] },
  },
});

export const textarea = style([input, { height: 'auto', padding: '10px 12px', lineHeight: '150%', resize: 'vertical' }]);

export const inputError = style({ borderColor: danger });

// DropDown은 바깥 div에 className이 붙으므로 안쪽 버튼 테두리를 바꿈
export const dropError = style({});
globalStyle(`${dropError} > button`, { borderColor: danger });

export const errorText = style({ fontSize: 13, color: danger });

const btn = style({
  height: 44,
  padding: '0 18px',
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  selectors: { '&:disabled': { opacity: 0.6, cursor: 'default' } },
});

export const primaryBtn = style([
  btn,
  {
    border: `1px solid ${vars.color.blue1}`,
    backgroundColor: vars.color.blue1,
    color: 'white',
    transition: 'transform .15s ease, box-shadow .15s ease',
    selectors: {
      '&:hover:not(:disabled)': { transform: 'translate(-2px, -2px)', boxShadow: '4px 4px 0 0 #5BB8FE' },
    },
  },
]);

export const rejectBtn = style([
  btn,
  {
    marginLeft: 'auto',
    padding: '0 14px',
    border: `1px solid ${vars.slate[200]}`,
    backgroundColor: 'white',
    color: danger,
    selectors: { '&:hover': { backgroundColor: vars.slate[100] } },
  },
]);

export const dangerBtn = style([btn, { padding: '0 16px', border: `1px solid ${danger}`, backgroundColor: danger, color: 'white' }]);

export const refundBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  border: '1px solid #F1C4C6',
  backgroundColor: 'white',
});

export const refundFoot = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const cardError = style({
  margin: 0,
  padding: '10px 20px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: '#FFF5F5',
  fontSize: 14,
  color: danger,
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 카드 안 div는 부모 색을 따르게
globalStyle(`${card} div`, { color: 'inherit' });

export const suspectLabel = style({});
// `${info} dt`보다 구체적이어야 색이 바뀜
globalStyle(`${info} ${suspectLabel}`, { color: danger });

export const suspect = style({ display: 'flex', flexDirection: 'column', gap: 4, color: danger });
