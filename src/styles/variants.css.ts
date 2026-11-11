import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
// import {
//   rangeWidth,
//   rangeHeight,
//   rangeGap,
// } from '@/shared/ui/Range/range.css';

// export const base = style({
//   borderRadius: 8,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// });

// =========== Btn 변수 ===========

export const btnSizeVariants = styleVariants({
  small: {
    width: '30px',
    height: '30px',
    fontSize: '24px',
    letterSpacing: '-1.2px',
  } as const,
  medium: {
    width: '180px',
    height: '50px',
    fontSize: '20px',
    letterSpacing: '-1px',
  } as const,
  big: {
    width: '320px',
    height: '60px',
    fontSize: '22px',
    letterSpacing: '-1.1px',
  } as const,
  extra: {
    width: '350px',
    height: '50px',
    fontSize: '20px',
    letterSpacing: '-1px',
  } as const,
});

export const colorVariants = styleVariants({
  primary: { backgroundColor: vars.color.blue1, color: 'white' } as const,
  reversePrimary: {
    backgroundColor: 'white',
    color: vars.color.blue1,
  } as const,
});

// =========== Range 변수 ===========
export const widthVariant = styleVariants({
  fit: { width: 'fit-content' } as const,
  full: { width: '100%' } as const,
  '320': { width: '320px' } as const,
  '340': { width: '340px' } as const,
  '960': { width: '960px' } as const,
  // dynamic: { width: rangeWidth } as const,
});

export const heightVariant = styleVariants({
  fit: { height: 'fit-content' } as const,
  full: { height: '100%' } as const,
  '45': { height: '45px' } as const,
  '70': { height: '70px' } as const,
  '450': { height: '450px' } as const,
  // dynamic: { height: rangeHeight } as const,
});

export const gapVariant = styleVariants({
  none: { gap: '0px' } as const,
  '4 10': { gap: '4px 10px' } as const,
  '4': { gap: '4px' } as const,
  '5': { gap: '5px' } as const,
  '8': { gap: '8px' } as const,
  '10': { gap: '10px' } as const,
  '15': { gap: '15px' } as const,
  '30': { gap: '30px' } as const,
  '50': { gap: '50px' } as const,
  '10 30': { gap: '10px 30px' } as const,
  '10 0': { gap: '10px 0px' } as const,
  // dynamic: { gap: rangeGap } as const,
});

export const rangePresetVariant = styleVariants({
  alignCenter: {
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  left: {
    justifyContent: 'start',
    // alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  between: {
    width: '100%',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  bottom: {
    alignItems: 'bottom',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  columnAlignCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const directionVariant = styleVariants({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});

export const justifyVariant = styleVariants({
  spacebetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
  },
  start: {
    justifyContent: 'start',
  },
  right: {
    justifyContent: 'flex-end',
  },
});

export const alignVariant = styleVariants({
  center: {
    alignItems: 'center',
  },
  stretch: {
    alignItems: 'stretch',
  },
});

// =========== labeltitle 변수 ===========
export const labelVariant = styleVariants({
  small: {
    width: 60,
    fontSize: 14,
    letterSpacing: '-0.7px',
    lineHeight: '120%',
  },
  large: {
    width: 80,
    fontSize: 20,
    letterSpacing: '-0.9px',
    lineHeight: '120%',
    fontFamily: 'silkscreen',
  },
});

export const contentVariant = styleVariants({
  small: {
    // width: 'clac(100% - 60px)',
    fontSize: 14,
    letterSpacing: '-0.7px',
    lineHeight: '120%',
  },
  large: {
    // width: 'clac(100% - 100px)',
    fontSize: 20,
    letterSpacing: '-1px',
    lineHeight: '120%',
    fontFamily: 'silkscreen',
  },
});

// =========== category 변수 ===========

export const categoryVariant = styleVariants({
  header: {
    width: 1000,
    fontSize: 14,
    letterSpacing: '-0.7px',
    lineHeight: '120%',
    zIndex: 10,
    position: 'absolute',

    translate: '-50%',
    left: '50%',
    top: '60px',
  },
  menu: {
    // width: 'clac(100% - 100px)',
    width: 1314,
    fontSize: 20,
    letterSpacing: '-1px',
    lineHeight: '120%',
    zIndex: 0,
    marginTop: '-1px',
  },
});

// =========== ReactSlick 변수 ===========

export const reactSlickVariant = styleVariants({
  small: {
    width: '450px',
    height: '450px',
    border: `1px solid ${vars.color.gray1}`,
  },
  banner: {
    width: '1312px',
    height: '437px',
    borderBottom: `2px solid ${vars.color.gray1}`,
    borderLeft: `1px solid ${vars.color.gray1}`,
    borderRight: `1px solid ${vars.color.gray1}`,
  },
});

// =========== TicketContainer 변수 ===========

export const ticketContainerVariant = styleVariants({
  detail: {
    width: '960px',
    maxWidth: '960px',
    marginBottom: '30px',
  },
  none: {
    width: '1140px',
    maxWidth: '1070px',
  },
});

// 체크박스: 각진 칸 + 픽셀 체크(pixelarticons check), 켜지면 blue1 배경
const pixelCheck = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' shape-rendering='crispEdges'%3E%3Cpath d='M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z'/%3E%3C/svg%3E")`;

export const checkbox = style({
  appearance: 'none',
  width: 20,
  height: 20,
  flex: '0 0 20px',
  margin: 0,
  boxSizing: 'border-box',
  // 흰 배경에서 칸 테두리가 보이도록 slate500 (3:1 이상)
  border: `1px solid ${vars.slate[500]}`,
  borderRadius: 0,
  backgroundColor: 'white',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  // 24 그리드 아이콘을 24px로 그려 픽셀 한 칸이 정확히 2px (체크 모양은 4~20 안에 있어 칸을 넘지 않음)
  backgroundSize: '24px 24px',
  cursor: 'pointer',
  transition: 'background-color .15s ease, border-color .15s ease',
  selectors: {
    '&:hover': { borderColor: vars.color.blue1 },
    '&:checked': { borderColor: vars.color.blue1, backgroundColor: vars.color.blue1, backgroundImage: pixelCheck },
    '&:focus-visible': { outline: `2px solid ${vars.ink[400]}`, outlineOffset: 2 },
    '&:disabled': { borderColor: vars.slate[200], backgroundColor: vars.slate[50], cursor: 'default' },
  },
});

// 관리자 목록 검색창 (돋보기 + input)
export const searchField = style({
  flex: '0 1 340px',
  minWidth: 220,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 0 0 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  color: vars.slate[500],
  selectors: {
    '&:focus-within': { borderColor: vars.color.blue1, boxShadow: `3px 3px 0 0 ${vars.color.blueLight}` },
  },
});

globalStyle(`${searchField} svg`, { width: 20, height: 20, fill: 'currentColor', flex: '0 0 auto' });

export const searchFieldInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: 42,
  padding: '0 12px 0 0',
  border: 0,
  outline: 'none',
  font: 'inherit',
  fontSize: 15,
  color: vars.slate[800],
  backgroundColor: 'transparent',
  selectors: { '&::placeholder': { color: vars.slate[500] } },
});
