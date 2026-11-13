import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, tone } = vars;
const clamp2 = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' } as const;

export const noticeTag = style({ minWidth: 52, boxSizing: 'border-box', justifyContent: 'center' });

// ── 목록 한 줄 ──
export const row = style({
  display: 'grid',
  gridTemplateColumns: '72px minmax(0, 1fr) auto',
  gridTemplateAreas: '"tag title date"',
  alignItems: 'center',
  gap: 16,
  minHeight: 72,
  boxSizing: 'border-box',
  padding: '14px 8px',
  borderBottom: `1px solid ${slate[100]}`,
  transition: 'background-color .12s ease',
  selectors: {
    '&:hover': { backgroundColor: slate[50] },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'auto 1fr',
      gridTemplateAreas: '"tag date" "title title"',
      gap: 6,
      minHeight: 0,
      padding: '16px 0',
    },
  },
});

export const title = style({
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: -0.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color .12s ease',
  selectors: { [`${row}:hover &`]: { color: color.blue1 } },
  '@media': { [mobile]: { fontSize: fluid(14), lineHeight: '145%', ...clamp2 } },
});

export const tagCell = style({ gridArea: 'tag', display: 'flex', alignItems: 'center', gap: 6 });
export const titleCell = style({ gridArea: 'title', minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 });
export const date = style({
  gridArea: 'date',
  fontSize: 14,
  color: slate[500],
  whiteSpace: 'nowrap',
  '@media': { [mobile]: { fontSize: fluid(11), justifySelf: 'end' } },
});

const newBadge = style({
  flex: '0 0 auto',
  fontFamily: 'silkscreen',
  fontSize: 11,
  '@media': { [mobile]: { fontSize: fluid(10) } },
  padding: '2px 6px 3px',
  borderRadius: 15,
  backgroundColor: '#FFDFAB',
  color: 'white',
});
export const newDesk = style([newBadge, { '@media': { [mobile]: { display: 'none' } } }]);
export const newMobile = style([newBadge, { display: 'none', '@media': { [mobile]: { display: 'inline-block' } } }]);

// ── 고정 공지 카드 ──
export const pinned = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '20px 22px',
  border: `1px solid ${color.blue1}`,
  backgroundColor: tone.info.bg,
  selectors: { '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 } },
  '@media': { [mobile]: { gap: 12, padding: '14px 12px 14px 14px' } },
});
export const pinIcon = style({
  flex: '0 0 44px',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color.blue1,
  color: 'white',
  '@media': { [mobile]: { flexBasis: 36, width: 36, height: 36 } },
});
export const pinBody = style({ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 });
export const pinLabel = style({ fontFamily: 'silkscreen', fontSize: 12, color: color.blue1, '@media': { [mobile]: { fontSize: fluid(10) } } });
export const pinTitle = style({
  fontSize: 17,
  fontWeight: 700,
  letterSpacing: -0.6,
  '@media': { [mobile]: { fontSize: fluid(14), lineHeight: '140%', ...clamp2 } },
});
export const pinDate = style({ fontSize: 13, color: slate[600], '@media': { [mobile]: { fontSize: fluid(11) } } });
export const pinArrow = style({ flex: '0 0 auto', color: color.blue1 });

export const shareBtn = style({ flex: '0 0 auto' });
