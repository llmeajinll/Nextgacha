import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnPx, btnSize, mobile } from '@/styles/ui.css';

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

// 신고 창: 버튼 왼쪽 위로 열림
export const reportWrap = style({ position: 'relative' });
export const panel = style({
  position: 'absolute',
  right: 0,
  bottom: 'calc(100% + 8px)',
  width: 'min(340px, calc(100vw - 32px))',
  boxSizing: 'border-box',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  boxShadow: `3px 3px 0 0 ${color.blueLight}`,
});
export const panelTitle = style({ fontSize: 15, fontWeight: 700, color: slate[800] });
export const panelHint = style({ fontSize: 12, color: slate[500] });
export const textarea = style({
  width: '100%',
  minHeight: 110,
  padding: 10,
  border: `1px solid ${slate[200]}`,
  font: 'inherit',
  fontSize: 14,
  resize: 'vertical',
  selectors: { '&:focus': { outline: 'none', borderColor: color.blue1 } },
});
export const sendBtn = style([btn, btnSize.s, btnPx, btnKind.primary, { alignSelf: 'flex-end' }]);
