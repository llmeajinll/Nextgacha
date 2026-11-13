import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {btn, btnKind, btnSize, mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, status } = vars;

// 웹: 1120px 안 위아래로 쌓기 / 모바일: 배너는 화면 끝까지, 섹션 머리만 16px 들여쓰기
export const page = style({
  maxWidth: 1120,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: '32px 24px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 56,
  '@media': { [mobile]: { padding: '0 0 32px', gap: 32 } },
});

export const section = style({ display: 'flex', flexDirection: 'column', gap: 24, '@media': { [mobile]: { gap: 14 } } });

export const head = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  paddingBottom: 16,
  borderBottom: `2px solid ${slate[800]}`,
  '@media': { [mobile]: { gap: 12, margin: '0 16px', paddingBottom: 12 } },
});
export const headText = style({ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0, '@media': { [mobile]: { gap: 8 } } });

export const title = style({
  margin: 0,
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: -1.2,
  lineHeight: '120%',
  color: slate[800],
  '@media': { [mobile]: { fontSize: fluid(18), letterSpacing: -0.9 } },
});

export const badge = style({
  fontFamily: 'silkscreen',
  fontSize: 12,
  lineHeight: 1,
  padding: '5px 8px 6px',
  color: 'white',
  '@media': { [mobile]: { fontSize: fluid(10), padding: '4px 7px 5px' } },
});
export const badgeTone = styleVariants({
  hot: { backgroundColor: status.hot },
  new: { backgroundColor: status.new },
  reserve: { backgroundColor: status.reserve },
});

export const moreLink = style([btn, btnSize.s, btnKind.link, { '@media': { [mobile]: { height: 44, padding: '0 0 0 4px' } } }]);

// 웹: 칸 240px 이상으로 채우기 / 모바일: 156px 카드를 옆으로 밀기
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
  gap: 20,
  '@media': {
    [mobile]: {
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      scrollSnapType: 'x proximity',
      scrollPadding: '0 16px',
      padding: '4px 16px 6px',
      scrollbarWidth: 'none',
      selectors: { '&::-webkit-scrollbar': { display: 'none' } },
    },
  },
});
globalStyle(`${grid} > *`, { '@media': { [mobile]: { flex: '0 0 156px', scrollSnapAlign: 'start' } } });
