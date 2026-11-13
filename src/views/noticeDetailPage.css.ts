import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {btn, btnKind, btnPx, btnSize, mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, tone } = vars;

export const article = style({
  maxWidth: 1120, // 공지 목록(NoticeTemplate pageWrap)과 같은 폭
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: '40px 24px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  '@media': { [mobile]: { padding: '16px 16px 40px', gap: 20 } },
});

export const backLink = style([
  btn,
  btnKind.text,
  { alignSelf: 'flex-start', padding: 0, height: 32, '@media': { [mobile]: { height: 44 } } },
]);

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingBottom: 24,
  borderBottom: `2px solid ${slate[800]}`,
  '@media': { [mobile]: { gap: 10, paddingBottom: 16, marginTop: -8 } },
});

export const tagRow = style({ display: 'flex', alignItems: 'center', gap: 8 });

export const pinLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: 'silkscreen',
  fontSize: 12,
  color: color.blue1,
  '@media': { [mobile]: { fontSize: fluid(11) } },
});

export const title = style({
  margin: 0,
  fontSize: 30,
  fontWeight: 700,
  letterSpacing: -1.4,
  lineHeight: '135%',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
  '@media': { [mobile]: { fontSize: fluid(18), letterSpacing: -0.8 } },
});

export const meta = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' });

export const date = style({ fontSize: 14, color: slate[500], '@media': { [mobile]: { fontSize: fluid(12) } } });

// div는 부모 color를 상속하지 않아서 section으로 둔다
export const body = style({
  minHeight: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  fontSize: 16,
  lineHeight: '180%',
  color: slate[700],
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
  '@media': { [mobile]: { minHeight: 400, gap: 14, fontSize: fluid(14) } },
});

export const text = style({ margin: 0, whiteSpace: 'pre-wrap' });

export const heading = style({
  margin: '10px 0 0',
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: -0.6,
  lineHeight: '140%',
  color: slate[800],
  '@media': { [mobile]: { margin: '6px 0 0', fontSize: fluid(15) } },
});

export const quote = style({
  margin: 0,
  padding: '14px 18px',
  borderLeft: `3px solid ${color.blue1}`,
  backgroundColor: tone.info.bg,
  fontSize: 15,
  lineHeight: '170%',
  whiteSpace: 'pre-wrap',
  '@media': { [mobile]: { padding: '12px 14px', fontSize: fluid(13) } },
});

// 본문 이미지: 가로를 채우고 비율 유지 (모바일은 화면 끝까지)
export const image = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  '@media': { [mobile]: { width: 'calc(100% + 32px)', margin: '0 -16px' } },
});

export const adjNav = style({ display: 'flex', flexDirection: 'column', marginTop: 24, borderTop: `1px solid ${slate[200]}`, '@media': { [mobile]: { marginTop: 12 } } });

export const adjRow = style({
  display: 'grid',
  gridTemplateColumns: '72px 64px minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 12,
  minHeight: 60,
  padding: '0 8px',
  borderBottom: `1px solid ${slate[200]}`,
  transition: 'background-color .12s ease',
  selectors: {
    '&:hover': { backgroundColor: slate[50] },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
  '@media': { [mobile]: { gridTemplateColumns: '48px minmax(0, 1fr)', gap: 8, minHeight: 56, padding: 0 } },
});

export const adjDir = style({ fontFamily: 'silkscreen', fontSize: 13, color: slate[500], '@media': { [mobile]: { fontSize: fluid(11) } } });
export const adjTag = style({ '@media': { [mobile]: { display: 'none' } } });
export const adjTitle = style({
  fontSize: 15,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': { [mobile]: { fontSize: fluid(13) } },
});
export const adjDate = style({ fontSize: 13, color: slate[500], '@media': { [mobile]: { display: 'none' } } });

export const listBtn = style([
  btn,
  btnSize.l,
  btnPx,
  btnKind.neutral,
  { alignSelf: 'center', width: 200, '@media': { [mobile]: { alignSelf: 'stretch', width: 'auto' } } },
]);
