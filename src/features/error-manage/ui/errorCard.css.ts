import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const danger = '#A3262A';

export const card = style({ border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white' });

export const cardPayment = style({ borderColor: '#F1C4C6' });

export const head = style({
  minHeight: 52,
  boxSizing: 'border-box',
  padding: '6px 20px',
  borderBottom: `1px solid ${vars.slate[100]}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 14px',
});

const tag = style({ fontSize: 12, fontWeight: 600, padding: '4px 8px' });

export const typeTag = styleVariants({
  payment: [tag, { backgroundColor: danger, color: 'white' }],
  system: [tag, { backgroundColor: '#DDF0FD', color: vars.ink[600] }],
  report: [tag, { backgroundColor: '#FFF1D6', color: '#7A4B00' }],
});

export const statusTag = styleVariants({
  접수: [tag, { marginLeft: 'auto', backgroundColor: '#FFF1D6', color: '#7A4B00' }],
  '처리 완료': [tag, { marginLeft: 'auto', backgroundColor: vars.slate[100], color: vars.slate[700] }],
  무시: [tag, { marginLeft: 'auto', backgroundColor: vars.slate[100], color: vars.slate[600] }],
});

export const date = style({ fontSize: 13, color: vars.slate[600] });

export const path = style({
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  padding: '3px 8px',
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: 12,
  backgroundColor: vars.slate[50],
  border: `1px solid ${vars.slate[100]}`,
  color: vars.slate[700],
});

export const body = style({ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 });

export const message = style({
  margin: 0,
  fontSize: 15,
  lineHeight: '160%',
  color: vars.slate[800],
  overflowWrap: 'anywhere',
  whiteSpace: 'pre-wrap',
});

// 시스템 기록은 에러 원문이라 고정폭
export const messageCode = style({ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13 });

export const clamp = style({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const toggle = style({
  alignSelf: 'flex-start',
  minHeight: 44,
  padding: 0,
  border: 0,
  background: 'none',
  font: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  color: vars.ink[600],
  cursor: 'pointer',
});

export const foot = style({
  padding: '12px 20px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
});

export const footClosed = style({ justifyContent: 'space-between' });

export const muted = style({ fontSize: 14, color: vars.slate[600] });

const btn = style({
  height: 44,
  padding: '0 16px',
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  selectors: { '&:disabled': { opacity: 0.6, cursor: 'default' } },
});

export const primaryBtn = style([
  btn,
  {
    padding: '0 18px',
    border: `1px solid ${vars.color.blue1}`,
    backgroundColor: vars.color.blue1,
    color: 'white',
    transition: 'transform .15s ease, box-shadow .15s ease',
    selectors: { '&:hover:not(:disabled)': { transform: 'translate(-2px, -2px)', boxShadow: '4px 4px 0 0 #5BB8FE' } },
  },
]);

export const ghostBtn = style([
  btn,
  {
    border: `1px solid ${vars.slate[200]}`,
    backgroundColor: 'white',
    color: vars.slate[800],
    selectors: { '&:hover:not(:disabled)': { backgroundColor: vars.slate[100] } },
  },
]);

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
