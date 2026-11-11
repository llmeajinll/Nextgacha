import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnSize, tag, tagTone } from '@/styles/ui.css';

const danger = vars.tone.danger[1];

export const card = style({ border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white' });

export const cardPayment = style({ borderColor: vars.tone.danger[2] });

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

export const typeTag = styleVariants({
  payment: [tag, { backgroundColor: danger, color: 'white' }],
  system: [tag, tagTone.info],
  report: [tag, tagTone.warning],
});

const right = { marginLeft: 'auto' };

export const statusTag = styleVariants({
  접수: [tag, tagTone.warning, right],
  '처리 완료': [tag, tagTone.neutral, right],
  무시: [tag, tagTone.muted, right, { backgroundColor: vars.slate[100] }],
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

// 전체 보기 · 접기
export const toggle = style([btn, btnSize.s, btnKind.text, { alignSelf: 'flex-start', minHeight: 44, padding: 0 }]);

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

export const primaryBtn = style([btn, btnKind.primary]);

export const ghostBtn = style([btn, btnKind.neutral]);

export const cardError = style({
  margin: 0,
  padding: '10px 20px',
  borderTop: `1px solid ${vars.slate[100]}`,
  backgroundColor: vars.tone.danger.bg,
  fontSize: 14,
  color: danger,
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 카드 안 div는 부모 색을 따르게
globalStyle(`${card} div`, { color: 'inherit' });
