import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile, utab, utabs } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, tone } = vars;

// 디자인 캔버스 MyCart의 밑줄 탭 (모바일은 화면 끝까지)
export const tabs = style([utabs, { '@media': { [mobile]: { margin: '0 -16px', padding: '0 8px' } } }]);
export const tab = style([utab, { fontFamily: 'silkscreen', fontWeight: 400, gap: 8 }]);

export const count = style({
  minWidth: 22,
  height: 22,
  boxSizing: 'border-box',
  padding: '0 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'silkscreen',
  fontSize: 12,
  '@media': { [mobile]: { fontSize: fluid(11) } },
  lineHeight: 1,
  backgroundColor: tone.soldout.bg,
  color: tone.soldout[2],
  selectors: { [`${tab}[aria-current="page"] &`]: { backgroundColor: color.blue1, color: 'white' } },
});
