import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {btn, btnIcon, btnKind, btnSize, checkbox as uiCheckbox, mobile, optionChip } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate } = vars;
const pixel = 'silkscreen';
const m = (n: number) => ({ '@media': { [mobile]: { fontSize: fluid(n) } } });

// 디자인 캔버스 MyCart / MyCartMobile의 상품 그룹 카드
export const group = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const head = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 16,
  borderBottom: `1px solid ${slate[100]}`,
  '@media': { [mobile]: { gap: 12, padding: 12 } },
});

export const thumb = style({
  width: 72,
  height: 72,
  flex: '0 0 72px',
  objectFit: 'cover',
  backgroundColor: color.blueBg,
  '@media': { [mobile]: { width: 52, height: 52, flexBasis: 52 } },
});

export const headText = style({ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 });

export const title = style({
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: -0.4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  selectors: { '&:hover': { color: color.blue1 } },
  '@media': { [mobile]: { fontSize: fluid(14) } },
});

export const sub = style({ fontSize: 12, color: slate[500], ...m(11) });
export const pxBlue = style({ fontFamily: pixel, color: color.blue1 });

export const sum = style({ fontFamily: pixel, fontSize: 16, whiteSpace: 'nowrap', '@media': { [mobile]: { fontSize: fluid(13) } } });
export const sumUnit = style({ '@media': { [mobile]: { display: 'none' } } });

export const iconBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost]);
export const stepBtn = style([btn, btnSize.s, btnIcon, btnKind.neutral]);

export const chevron = style({ transition: 'transform .15s steps(2)' });
export const chevronOpen = style({ transform: 'rotate(180deg)' });

// 접었을 때: 옵션 이름 × 수량 칩
export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  padding: '12px 16px',
  backgroundColor: slate[50],
  '@media': { [mobile]: { padding: 12 } },
});
export const chip = style([optionChip, { gap: 6, ...m(12) }]);
export const chipOff = style({ color: slate[400] });
export const chipQty = style({ fontFamily: pixel, fontSize: 12, color: color.blue1, ...m(11) });

// 옵션 한 줄: 웹은 한 줄, 모바일은 (선택 | 이름 | 삭제) / (수량 | 금액) 두 줄
export const line = style({
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr) auto 112px 36px',
  gridTemplateAreas: '"check name qty total del"',
  alignItems: 'center',
  gap: 16,
  padding: '12px 16px',
  borderBottom: `1px solid ${slate[100]}`,
  backgroundColor: 'white',
  selectors: { '&:last-child': { borderBottom: 0 } },
  '@media': {
    [mobile]: {
      gridTemplateColumns: '24px minmax(0, 1fr) auto',
      gridTemplateAreas: '"check name del" ". qty total"',
      columnGap: 12,
      rowGap: 10,
      padding: 12,
    },
  },
});
export const lineOff = style({ backgroundColor: slate[50] });

export const checkbox = style([uiCheckbox, { gridArea: 'check' }]);

export const name = style({ gridArea: 'name', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 });
export const nameText = style({ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...m(14) });
export const ship = style({ color: color.blue1 });

export const stepper = style({ gridArea: 'qty', display: 'inline-flex', alignItems: 'center' });
export const qty = style({
  width: 40,
  height: 36,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTop: `1px solid ${slate[200]}`,
  borderBottom: `1px solid ${slate[200]}`,
  fontFamily: pixel,
  fontSize: 16,
  ...m(14),
});

export const total = style({ gridArea: 'total', textAlign: 'right', fontFamily: pixel, fontSize: 15, ...m(14) });
export const del = style([iconBtn, { gridArea: 'del', justifySelf: 'end' }]);

globalStyle(`${group} a`, { color: 'inherit', textDecoration: 'none' });
