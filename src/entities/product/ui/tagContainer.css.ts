import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

export const container = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 4,
  minHeight: 22,
  '@media': { [mobile]: { minHeight: 20 } },
});

// 모바일은 둥근 알약 모양
const base = style({
  lineHeight: 1,
  padding: '4px 6px 5px',
  color: 'white',
  '@media': { [mobile]: { padding: '3px 7px 4px', borderRadius: 15, fontSize: fluid(10) } },
});
export const pxTag = style([base, { fontFamily: 'silkscreen', fontSize: 11 }]);
export const reserveTag = style([base, { fontSize: 12, fontWeight: 500 }]);

export const tone = styleVariants({
  new: { backgroundColor: vars.status.new },
  hot: { backgroundColor: vars.status.hot },
  reserve: { backgroundColor: vars.status.reserve },
});
