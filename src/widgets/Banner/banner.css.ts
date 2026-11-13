import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, mobile } from '@/styles/ui.css';

const { color, slate } = vars;
const hideScrollbar = { scrollbarWidth: 'none', selectors: { '&::-webkit-scrollbar': { display: 'none' } } } as const;

export const wrap = style({ display: 'flex', flexDirection: 'column', gap: 12, '@media': { [mobile]: { gap: 0 } } });

export const track = style({
  ...hideScrollbar,
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  border: `1px solid ${slate[200]}`,
  backgroundColor: color.blueBg,
  '@media': { [mobile]: { border: 0, borderBottom: `1px solid ${slate[200]}` } },
});

// 웹 3:1(배너 원본 1312×437), 모바일 2:1로 가운데를 기준으로 잘린다
export const slide = style({
  position: 'relative',
  flex: '0 0 100%',
  aspectRatio: '3 / 1',
  minHeight: 160,
  scrollSnapAlign: 'start',
  '@media': { [mobile]: { aspectRatio: '2 / 1', minHeight: 0 } },
});
export const img = style({ objectFit: 'cover' });

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  '@media': { [mobile]: { justifyContent: 'center' } },
});

export const dots = style({ display: 'flex', alignItems: 'center', gap: 4, '@media': { [mobile]: { gap: 0 } } });

export const dot = style({
  width: 44,
  height: 44,
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.55,
  transition: 'transform .1s steps(2)',
  selectors: {
    '&[aria-current="true"]': { opacity: 1 },
    '&:hover': { transform: 'translateY(-2px)' },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
  '@media': {
    [mobile]: { width: 28 },
    '(prefers-reduced-motion: reduce)': { selectors: { '&:hover': { transform: 'none' } } },
  },
});

export const capsule = style({
  width: 20,
  height: 20,
  selectors: { [`${dot}[aria-current="true"] &`]: { width: 28, height: 28 } },
  '@media': { [mobile]: { width: 14, height: 14, selectors: { [`${dot}[aria-current="true"] &`]: { width: 20, height: 20 } } } },
});

export const arrows = style({ display: 'flex', alignItems: 'center', gap: 6, '@media': { [mobile]: { display: 'none' } } });
export const counter = style({ marginRight: 6, fontFamily: 'silkscreen', fontSize: 14, color: slate[600] });
export const arrow = style([btn, btnIcon, btnKind.neutral]);
