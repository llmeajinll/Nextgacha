import { style, createVar } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
// import { style as dynamicStyle } from '@vanilla-extract/dynamic';

export const tagColor = createVar();

export const tag = style({
  boxSizing: 'border-box',
  backgroundColor: tagColor,
  width: 'fit-content',
  height: 22,
  padding: '4px 8px 5px 8px',
  borderRadius: '15px',
  fontSize: vars.font.tagFont.fontSize,
  letterSpacing: vars.font.tagFont.letterSpacing,
  lineHeight: vars.font.tagFont.lineHeight,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  //   color: 'black',
  //   fontWeight: 'bold',
});

// export const tagColor = dynamicStyle((color: string) => ({
//   backgroundColor: color,
// }));
