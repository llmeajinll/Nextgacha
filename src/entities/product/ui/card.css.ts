import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, tone } = vars;
const reduced = '(prefers-reduced-motion: reduce)';

// 올리면 왼쪽 위로 2px 뜨고 픽셀 그림자 (디자인 .hm-card)
export const card = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  transition: 'transform .12s steps(2), box-shadow .12s steps(2), border-color .12s ease',
  selectors: {
    '&:hover, &:focus-within': {
      transform: 'translate(-2px, -2px)',
      boxShadow: `4px 4px 0 0 ${color.blue2}`,
      borderColor: color.blue1,
    },
  },
  '@media': { [reduced]: { transition: 'none', selectors: { '&:hover, &:focus-within': { transform: 'none' } } } },
});

export const link = style({ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 });

export const image = style({ display: 'block', width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover', backgroundColor: slate[50] });

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '14px 16px 0',
  '@media': { [mobile]: { gap: 6, padding: '10px 12px 0' } },
});

export const title = style({
  minHeight: 44,
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: -0.4,
  lineHeight: '145%',
  color: slate[800],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-word',
  transition: 'color .12s ease',
  selectors: { [`${card}:hover &, ${card}:focus-within &`]: { color: color.blueInk } },
  '@media': { [mobile]: { minHeight: 40, fontSize: fluid(13) } },
});

export const bottom = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 48,
  padding: '0 6px 4px 16px',
  '@media': { [mobile]: { padding: '0 2px 2px 12px' } },
});

export const price = style({
  display: 'inline-flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: 4,
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: -0.5,
  color: slate[800],
  '@media': { [mobile]: { fontSize: fluid(14) } },
});
export const unit = style({ fontSize: 13, fontWeight: 400, color: slate[600], '@media': { [mobile]: { fontSize: fluid(11) } } });
export const discountBadge = style({ color: color.blue1 });
export const originalPrice = style({ fontSize: 13, fontWeight: 400, color: slate[400], textDecoration: 'line-through' });

export const heart = style({
  width: 44,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color .1s ease, transform .1s steps(2)',
  selectors: {
    '&:hover:not(:disabled), &[aria-pressed="true"]': { color: tone.danger[2] },
    '&:active:not(:disabled)': { transform: 'scale(1.15)' },
  },
  '@media': { [reduced]: { selectors: { '&:active:not(:disabled)': { transform: 'none' } } } },
});

// theme의 globalStyle('div', { color }) 때문에 div가 색을 상속하지 않음
globalStyle(`${card} div`, { color: 'inherit' });
