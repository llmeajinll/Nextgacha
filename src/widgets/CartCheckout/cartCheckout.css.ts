import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {btn, btnBlock, btnKind, btnPx, btnSize, mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, tone } = vars;
const pixel = 'silkscreen';
const webOnly = { '@media': { [mobile]: { display: 'none' } } } as const;
const m = (n: number) => ({ '@media': { [mobile]: { fontSize: fluid(n) } } });

// 디자인 캔버스 MyCart(웹: 목록 + 오른쪽 340px 요약) / MyCartMobile(한 줄로 쌓고 아래 결제 바)
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 340px',
  gap: 28,
  alignItems: 'start',
  '@media': { [mobile]: { display: 'flex', flexDirection: 'column', gap: 16 } },
});

export const items = style({ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 });

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  paddingBottom: 12,
  borderBottom: `2px solid ${slate[800]}`,
});

export const allLabel = style({ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 15, fontWeight: 600, ...m(14) });
export const allCount = style({ fontFamily: pixel, fontSize: 14, fontWeight: 400, color: slate[500], ...m(13) });
export const removeBtn = style([btn, btnSize.s, btnKind.neutral, { marginLeft: 'auto' }]);

// ── 주문 요약 ──
export const summary = style({
  position: 'sticky',
  top: 24,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  '@media': { [mobile]: { position: 'static' } },
});

export const block = style({
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  borderBottom: `1px solid ${slate[100]}`,
  selectors: { '&:last-child': { borderBottom: 0 } },
});

export const blockHead = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
export const blockTitle = style({ fontSize: 14, fontWeight: 700, ...m(13) });
export const muted = style({ fontSize: 12, color: slate[500], ...m(11) });

// 배송지: 트럭은 제자리에서 덜컹거리고 배경(나무·건물·차선)이 뒤로 흘러 달리는 것처럼 보인다.
// 한 바퀴(DRIVE)마다 한 번 빠르게 오른쪽으로 사라졌다가 왼쪽에서 원래 자리로 돌아온다
const DRIVE = '7s';
const reduced = '(prefers-reduced-motion: reduce)';

const scroll = keyframes({ from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } });
const bump = keyframes({ '50%': { transform: 'translateY(-1px)' } });
const dash = keyframes({
  '0%, 64%': { left: '6%', animationTimingFunction: 'steps(6, end)' },
  '74%': { left: '110%' }, // 빠르게 화면 밖으로
  '74.01%': { left: '-12%', animationTimingFunction: 'steps(5, end)' }, // 안 보이는 왼쪽 끝으로 순간 이동
  '86%, 100%': { left: '6%' }, // 원래 자리로 돌아와 다시 달림
});
// 배송지를 저장하면 오른쪽 끝까지 한 번 달린다 (AddressEditor가 data-run을 잠깐 붙임)
const deliver = keyframes({ from: { left: '6%' }, to: { left: 'calc(100% - 16px)' } });

export const road = style({ position: 'relative', height: 24, overflow: 'hidden' });

// 같은 풍경 두 장을 이어 붙이고 절반만큼 밀어서 끊김 없이 반복
export const scenery = style({
  position: 'absolute',
  inset: 0,
  width: '200%',
  display: 'flex',
  animation: `${scroll} 6s linear infinite`,
  '@media': { [reduced]: { animation: 'none' } },
});
export const sceneryTile = style({ position: 'relative', flex: '1 1 0' });
export const roadDeco = style({ position: 'absolute', bottom: 3, lineHeight: 0 });
export const roadAt = styleVariants({ 14: {}, 30: {}, 38: {}, 56: {}, 64: {}, 78: {}, 92: {} }, (_, at) => ({ left: `${at}%` }));
export const roadLine = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 1,
  height: 2,
  background: `repeating-linear-gradient(90deg, ${color.blueLight} 0 6px, transparent 6px 10px)`,
});

export const truckDrive = style({
  position: 'absolute',
  left: '6%',
  bottom: 2,
  lineHeight: 0,
  animation: `${dash} ${DRIVE} infinite`,
  selectors: { '[data-run] &': { animation: `${deliver} .8s steps(10, end) forwards` } },
  '@media': { [reduced]: { animation: 'none' } },
});
export const truck = style({
  color: color.blue1,
  animation: `${bump} .4s steps(2, end) infinite`,
  '@media': { [reduced]: { animation: 'none' } },
});


// 포인트
export const pointRow = style({ display: 'flex', gap: 8 });
export const pointField = style({
  flex: '1 1 auto',
  height: 44,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 12px',
  border: `1px solid ${slate[200]}`,
  selectors: { '&:focus-within': { borderColor: color.blue1, boxShadow: `3px 3px 0 0 ${color.blueLight}` } },
});
export const pointInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  border: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  font: 'inherit',
  fontSize: 15,
  textAlign: 'right',
  color: slate[800],
});
export const pointUnit = style({ fontFamily: pixel, fontSize: 14, color: slate[500], ...m(13) });
export const allPointBtn = style([btn, btnKind.neutral]);
export const clampNote = style({ fontSize: 12, color: tone.warning[2], ...m(11) });

// 금액
export const amounts = style([block, { fontSize: 14, ...m(13) }]);
export const amountRow = style({ display: 'flex', justifyContent: 'space-between', color: slate[600] });
export const payRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  paddingTop: 12,
  marginTop: 4,
  borderTop: `1px solid ${slate[200]}`,
});
export const payLabel = style({ fontSize: 15, fontWeight: 700, ...m(14) });
export const payValue = style({ fontFamily: pixel, fontSize: 24, color: slate[800], '@media': { [mobile]: { fontSize: fluid(17) } } });
export const reward = style({ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 13, color: slate[600], ...m(12) });
export const rewardValue = style({ fontFamily: pixel, color: color.blue1 });

export const buyBtn = style([btn, btnSize.l, btnPx, btnKind.primary, btnBlock]);
export const webBuy = style([{ marginTop: 8 }, webOnly]);

// 모바일 결제 바: 아래 탭 바(MobileNav, 높이 65px) 바로 위에 붙는다
export const payBar = style({
  display: 'none',
  '@media': {
    [mobile]: {
      position: 'sticky',
      bottom: 'calc(65px + env(safe-area-inset-bottom, 0px))',
      zIndex: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '0 -16px',
      padding: '10px 16px',
      backgroundColor: 'white',
      boxShadow: `0 -1px 0 0 ${slate[200]}`,
    },
  },
});
export const payBarText = style({ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 });
export const payBarValue = style({ fontFamily: pixel, fontSize: fluid(16) });
export const payBarBtn = style({ flex: '0 0 140px' });

// 빈 장바구니
export const empty = style({
  padding: '80px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 14,
  textAlign: 'center',
  border: `1px solid ${slate[200]}`,
});
export const emptyTitle = style({ fontFamily: pixel, fontSize: 22, color: slate[300], ...m(20) });
export const emptyText = style({ fontSize: 15, color: slate[600], ...m(14) });
export const shopBtn = style([btn, btnPx, btnKind.primary]);
