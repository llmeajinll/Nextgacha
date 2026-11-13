import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate } = vars;

// 디자인 캔버스 MyCart / MyCartMobile의 "내 정보"
export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  flexWrap: 'wrap',
  minHeight: 64,
  '@media': { [mobile]: { gap: 12 } },
});

export const avatar = style({
  width: 64,
  height: 64,
  flex: '0 0 64px',
  objectFit: 'cover',
  backgroundColor: color.blueBg,
  color: color.blue1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': { [mobile]: { width: 48, height: 48, flexBasis: 48 } },
});

export const text = style({ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 });

export const name = style({
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: -0.6,
  color: slate[800],
  '@media': { [mobile]: { fontSize: fluid(15) } },
});

export const email = style({ fontSize: 14, color: slate[500], overflowWrap: 'anywhere', '@media': { [mobile]: { fontSize: fluid(12) } } });

export const pointBox = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 16px',
  backgroundColor: slate[50],
  '@media': { [mobile]: { flex: '1 1 100%', justifyContent: 'space-between', padding: '10px 14px' } },
});

export const pointLabel = style({ fontSize: 13, color: slate[600], '@media': { [mobile]: { fontSize: fluid(12) } } });
export const point = style({ fontFamily: 'silkscreen', fontSize: 18, color: color.blue1, '@media': { [mobile]: { fontSize: fluid(16) } } });
