import { styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
// import {
//   rangeWidth,
//   rangeHeight,
//   rangeGap,
// } from '@/components/atoms/Range/range.css';

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
  '10 30': { gap: '10px 30px' } as const,
  '10 0': { gap: '10px 0px' } as const,
  // dynamic: { gap: rangeGap } as const,
});

export const rangePresetVariant = styleVariants({
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
