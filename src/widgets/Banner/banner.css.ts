import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

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
