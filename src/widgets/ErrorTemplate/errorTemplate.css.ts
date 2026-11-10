import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const danger = '#A3262A';

export const container = style({ display: 'flex', flexDirection: 'column', gap: 20, color: vars.slate[800] });

// ── 처리 안 한 결제 기록 경고 ──
export const alert = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px 14px',
  padding: '14px 16px',
  border: '1px solid #F1C4C6',
  backgroundColor: '#FFF5F5',
  color: danger,
});

export const alertIcon = style({ width: 24, height: 24, flex: 'none' });

export const alertText = style({ margin: 0, flex: '1 1 360px', fontSize: 14, lineHeight: '150%' });

export const alertLink = style({
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 600,
  color: danger,
  selectors: { '&:hover': { textDecoration: 'underline' } },
});

// ── 처리 상태 탭 + 종류 필터 ──
export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const tabs = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 });

export const filter = style({ display: 'flex', border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white' });

export const filterItem = style({
  height: 42,
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  color: vars.slate[700],
  selectors: { '&:hover': { backgroundColor: vars.slate[50] } },
});

export const filterOn = style({
  backgroundColor: '#DDF0FD',
  color: vars.ink[700],
  fontWeight: 600,
  boxShadow: `inset 0 -2px 0 ${vars.color.blue1}`,
  selectors: { '&:hover': { backgroundColor: '#DDF0FD' } },
});

export const toast = style({ padding: '10px 14px', backgroundColor: '#DDF0FD', color: vars.ink[700], fontSize: 14 });

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

export const emptyPixel = style({ fontFamily: 'silkscreen', fontSize: 16, color: vars.color.blue1 });

export const emptyTitle = style({ fontSize: 15, fontWeight: 500 });

export const muted = style({ fontSize: 13, color: vars.slate[600] });

// theme의 globalStyle('div', { color })가 상속을 끊으므로 컨테이너 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
