import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const rotateVar = createVar();

export const sliderContainer = style({
  // width: '450px',
  // height: '450px',
  //   color: vars.color.black3,
  //   fontSize: '20px',
  //   lineHeight: '60px',
  //   textAlign: 'center',
  border: `1px solid ${vars.color.gray1}`,
  //   marginTop: '15px',
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
  position: 'absolute',
  width: 40,
  height: 136,
  backgroundColor: '#EFEFEF',
  borderRadius: 20,
  translate: '-50% -50%',
  left: '50%',
  top: '50%',
  zIndex: 5,
  transform: `rotate(${rotateVar})`,
  transition: 'transform 0.4s ease-in-out',
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
  borderRadius: '50%',
  translate: '-50% -50%',
  left: '50%',
  top: '50%',
  cursor: 'pointer',
  transform: `rotate(${rotateVar}) translate(0px, -58px)`,
});
