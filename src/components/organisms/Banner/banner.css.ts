import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const rotateStep = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '98%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(120deg)' },
});

export const bannerContainer = style({
  width: 1312,
  height: 550,
  position: 'relative',
});

export const eventConatiner = style({
  // display: 'flex',
  // overflow: 'hidden',
  //   width: 1312,
  // width: '100%',
  // height: 437,

  borderBottom: `1px solid ${vars.color.gray1}`,
  // borderLeft: `1px solid ${vars.color.gray1}`,
  borderRight: `1px solid ${vars.color.gray1}`,
});

export const lever = style({
  boxSizing: 'border-box',
  position: 'absolute',
  height: 151,
  width: 151,
  bottom: 0,
  translate: '-50%',
  left: '50%',
  borderRadius: '50%',
  border: `1px solid ${vars.color.gray1}`,
  backgroundColor: '#fdfdfd',
});

export const handle = style({
  //   rotate: '90deg',
  position: 'absolute',
  width: 40,
  height: 136,
  //   backgroundColor: '#EFEFEF',
  backgroundColor: '#EFEFEF',
  borderRadius: 20,
  translate: '-50% -50%',
  left: '50%',
  top: '50%',
  zIndex: 5,
  //   animation: `${rotateStep} 5s linear infinite`,
});

export const dot = style({
  position: 'absolute',
  width: 8,
  height: 8,
  backgroundColor: vars.color.blue1,
  borderRadius: '50%',
  translate: '-50%',
  left: '50%',
  top: 6,
  cursor: 'pointer',
});

export const slices = style({
  position: 'absolute',
  width: 8,
  height: 8,
  backgroundColor: vars.color.gray1,
  //   backgroundColor: vars.color.blue1,
  borderRadius: '50%',
  translate: '-50% -50%',
  left: '50%',
  top: '50%',
  //   transformOrigin: '0 0',
  cursor: 'pointer',
});
