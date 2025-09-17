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
  '450': { height: '450px' },
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
    fontSize: 18,
    letterSpacing: '-0.9px',
    lineHeight: '120%',
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
    width: 1312,
    fontSize: 20,
    letterSpacing: '-1px',
    lineHeight: '120%',
    zIndex: 0,
    marginTop: '-1px',
  },
});
