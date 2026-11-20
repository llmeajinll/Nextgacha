import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { mobile } from '@/styles/ui.css';

const { color, slate } = vars;

// 오른쪽 아래 고정: 위 GO TOP, 아래 오류 신고
export const stack = style({
  position: 'fixed',
  right: 24,
  bottom: 24,
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 8,
  '@media': { [mobile]: { right: 16, bottom: 16 } },
});

// 모바일에서 아래 탭 바(65px)·장바구니 결제 바(약 70px)를 피해서 띄움
const safe = 'env(safe-area-inset-bottom, 0px)';
export const lift = styleVariants({
  none: {},
  nav: { '@media': { [mobile]: { bottom: `calc(65px + 16px + ${safe})` } } },
  navPay: { '@media': { [mobile]: { bottom: `calc(65px + 70px + 16px + ${safe})` } } },
});

const floating = {
  width: 48,
  height: 48,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  color: slate[600],
  boxShadow: `3px 3px 0 0 ${color.blueLight}`,
  cursor: 'pointer',
  selectors: {
    '&:hover': { borderColor: color.blue1, color: color.blue1 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
} as const;

export const topBtn = style({ ...floating, flexDirection: 'column', gap: 2, fontFamily: 'silkscreen', fontSize: 10, lineHeight: 1 });
export const reportBtn = style(floating);
export const reportOn = style({ borderColor: color.blue1, color: color.blue1 });
