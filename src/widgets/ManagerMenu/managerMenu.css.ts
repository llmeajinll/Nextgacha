import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const pixel = 'silkscreen';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 36,
  color: vars.slate[800],
});

export const titleSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingBottom: 20,
  borderBottom: `1px solid ${vars.slate[200]}`,
});

export const eyebrow = style({
  fontFamily: pixel,
  fontSize: 14,
  letterSpacing: -0.7,
  color: vars.color.blue1,
});

export const title = style({
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: -1.4,
  lineHeight: '120%',
  color: vars.slate[800],
});

export const subText = style({
  margin: 0,
  fontSize: 15,
  letterSpacing: -0.5,
  color: vars.slate[600],
});

// ── 요약 카드 ──
export const summaryGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: 16,
});

export const summaryCard = style({
  boxSizing: 'border-box',
  border: `1px solid ${vars.slate[200]}`,
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  backgroundColor: 'white',
  transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
  selectors: {
    '&:hover': {
      transform: 'translate(-3px, -3px)',
      boxShadow: `6px 6px 0 0 ${vars.color.blue2}`,
      borderColor: vars.color.blue1,
    },
  },
});

export const summaryHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const summaryLabel = style({
  fontSize: 14,
  letterSpacing: -0.7,
  color: vars.slate[600],
});

export const summaryValue = style({
  fontFamily: pixel,
  fontSize: 32,
  letterSpacing: -1.6,
  lineHeight: 1,
  color: vars.slate[800],
});

export const iconTile = style({
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const tileTone = styleVariants({
  order: { backgroundColor: vars.tone.info.bg, color: vars.tone.info[1] },
  pending: { backgroundColor: vars.tone.warning.bg, color: vars.tone.warning[1] },
  product: { backgroundColor: vars.tone.success.bg, color: vars.tone.success[1] },
  error: { backgroundColor: vars.tone.danger.bg, color: vars.tone.danger[1] },
});

// ── 관리 메뉴 카드 ──
export const menuHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  marginBottom: 20,
});

export const menuTitle = style({
  margin: 0,
  fontSize: 24,
  fontWeight: 500,
  letterSpacing: -1.2,
  color: vars.slate[600],
});

export const pixelMuted = style({
  fontFamily: pixel,
  fontSize: 13,
  color: vars.slate[600],
});

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 20,
});

export const card = style({
  boxSizing: 'border-box',
  minHeight: 200,
  padding: 22,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
  selectors: {
    '&:hover': {
      transform: 'translate(-3px, -3px)',
      boxShadow: `6px 6px 0 0 ${vars.color.blue2}`,
      borderColor: vars.color.blue1,
    },
  },
});

export const cardIcon = style({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.color.blueBg,
  color: vars.color.blue1,
});

export const cardName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const cardEn = style({
  fontFamily: pixel,
  fontSize: 13,
  letterSpacing: -0.4,
  color: vars.color.blue1,
});

export const cardKo = style({
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: -1,
  color: vars.slate[800],
});

export const cardDesc = style({
  flex: 1,
  margin: 0,
  fontSize: 14,
  lineHeight: '150%',
  letterSpacing: -0.4,
  color: vars.slate[600],
});

export const cardGo = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 12,
  borderTop: `1px solid ${vars.slate[200]}`,
  fontFamily: pixel,
  fontSize: 14,
  color: vars.slate[800],
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 카드 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
