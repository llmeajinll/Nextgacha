import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {
  rangeWidth,
  rangeHeight,
  rangeGap,
} from '@/components/atoms/Range/range.css';

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
  },
  medium: {
    width: '180px',
    height: '50px',
    fontSize: '20px',
    letterSpacing: '-1px',
  },
});

export const colorVariants = styleVariants({
  primary: { backgroundColor: vars.color.blue1, color: 'white' },
  reversePrimary: { backgroundColor: 'white', color: vars.color.blue1 },
});

// =========== Range 변수 ===========
export const widthVariant = styleVariants({
  fit: { width: 'fit-content' },
  full: { width: '100%' },
  '960': { width: '960px' },
  dynamic: { width: rangeWidth },
});

export const heightVariant = styleVariants({
  fit: { height: 'fit-content' },
  full: { height: '100%' },
  dynamic: { height: rangeHeight },
});

export const gapVariant = styleVariants({
  none: { gap: '0px' },
  '10': { gap: '10px' },
  '15': { gap: '15px' },
  '30': { gap: '30px' },
  dynamic: { gap: rangeGap },
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
});

export const alignVariant = styleVariants({
  center: {
    alignItems: 'center',
  },
  stretch: {
    alignItems: 'stretch',
  },
});

// =========== ImgBtn 변수 ===========
