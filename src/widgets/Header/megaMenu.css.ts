import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnSize, ltab } from '@/styles/ui.css';

const { color, slate, status } = vars;
const pixel = 'silkscreen';
const steps = 'transform .12s steps(2), box-shadow .12s steps(2), border-color .12s ease';
const wiggle = keyframes({ '50%': { transform: 'rotate(-12deg)' } });
const calm = '(prefers-reduced-motion: reduce)';

// 헤더 바로 아래에 붙는 0px 기준점 (메뉴는 여기서 absolute로 내려옴)
export const anchor = style({ position: 'relative', zIndex: 5 });

export const menu = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderBottom: `1px solid ${slate[200]}`,
  boxShadow: `0 4px 0 0 ${color.blueBg}`,
});

export const inner = style({
  maxWidth: 1120,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: '20px 24px 24px',
  display: 'grid',
  gridTemplateColumns: '200px minmax(0, 1fr)',
  gap: 24,
  alignItems: 'start',
});

// ── 왼쪽: 큰 분류 ──
export const sections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  paddingRight: 20,
  borderRight: `1px solid ${slate[100]}`,
  maxHeight: 420,
  overflowY: 'auto',
});
export const section = style([ltab, { minHeight: 48 }]);
export const sectionIcon = style({
  flexShrink: 0,
  color: slate[400],
  selectors: { '[aria-pressed="true"] > &': { color: 'inherit' } },
});
export const sectionLabel = style({ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
export const sectionCount = style({ fontFamily: pixel, fontSize: 12, fontWeight: 400, color: slate[400] });

// ── 오른쪽: 선택한 분류의 메뉴 ──
export const panel = style({ minWidth: 0, minHeight: 300, display: 'flex', flexDirection: 'column', gap: 16 });
export const panelHead = style({ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 });
export const panelTitle = style({ display: 'flex', alignItems: 'baseline', gap: 10 });
export const en = style({ fontFamily: pixel, fontSize: 13, color: color.blue1 });
export const titleText = style({ fontSize: 18, fontWeight: 700, letterSpacing: -0.6 });
export const allLink = style([btn, btnSize.s, btnKind.link]);

// 메인: 2×2 카드
export const cards = style({ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 });
export const card = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: 16,
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  transition: steps,
  selectors: {
    '&:hover, &:focus-visible': { transform: 'translate(-2px, -2px)', boxShadow: `4px 4px 0 0 ${color.blue2}`, borderColor: color.blue1 },
  },
  '@media': { [calm]: { transition: 'none', selectors: { '&:hover, &:focus-visible': { transform: 'none' } } } },
});
export const cardGo = style({
  flex: '0 0 auto',
  color: slate[300],
  selectors: { [`${card}:hover &, ${card}:focus-visible &`]: { color: color.blue1 } },
});
export const cardTone = styleVariants({
  all: { backgroundColor: color.blue1 },
  hot: { backgroundColor: status.hot },
  new: { backgroundColor: status.new },
  reserve: { backgroundColor: status.reserve },
});
export const cardIcon = style({
  flex: '0 0 44px',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
});
export const cardBody = style({ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 });
export const cardName = style({ display: 'flex', alignItems: 'center', gap: 6 });
export const cardTitle = style({ fontSize: 15, fontWeight: 700 });
export const badge = style({ fontFamily: pixel, fontSize: 10, padding: '2px 6px 3px', borderRadius: 15, color: 'white' });
export const cardSub = style({ fontSize: 13, color: slate[500] });

// 캐릭터·애니·그룹: 4열 항목
export const items = style({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 });
export const itemText = style({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minHeight: 44,
  padding: '0 12px',
  fontSize: 14,
  color: slate[700],
  transition: 'background-color .1s ease, color .1s ease',
  selectors: { '&:hover, &:focus-visible': { backgroundColor: color.blueBg, color: slate[800] } },
});
globalStyle(`${item}:hover svg`, { animation: `${wiggle} .3s steps(2) infinite` });
globalStyle(`${item}:hover svg`, { '@media': { [calm]: { animation: 'none' } } });

// 캡슐 도트: 위쪽은 currentColor, 아래쪽은 고정색
export const tint = [status.new, status.hot, status.reserve, status.event, color.blue1].map((c) => style({ color: c, flex: '0 0 auto' }));
export const capMid = style({ fill: slate[300] });
export const capLow = style({ fill: slate[100] });

// 시리즈: 제조사별 열
export const makers = style({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 });
export const maker = style({ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 });
export const makerHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 12px 8px',
  marginBottom: 4,
  borderBottom: '2px solid',
});
export const makerTone = [status.new, status.hot, status.reserve, status.event, color.blue1].map((c) => style({ borderBottomColor: c }));
export const makerName = style({ fontSize: 14, fontWeight: 700 });
export const seriesItem = style({ minHeight: 40 });
