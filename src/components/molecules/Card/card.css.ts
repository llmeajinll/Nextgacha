import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cardContainer = style({
  // backgroundColor: 'red',
  width: 300,
  height: 'fit-content',
  paddingBottom: '25px',
});

export const cardImage = style({
  //   backgroundColor: 'red',
  boxSizing: 'border-box',
  border: `1px solid ${vars.color.gray1}`,
  width: 300,
  height: 300,
  marginBottom: 10,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'white',
});

export const infoContainer = style({
  padding: '0 5px',
});

export const TagContainer = style({
  display: 'flex',
  gap: 3,
  marginBottom: 5,
});

export const cardTitle = style({
  width: '100%',
  height: 42,
  fontSize: vars.font.cardTitle.fontSize,
  letterSpacing: vars.font.cardTitle.letterSpacing,
  lineHeight: vars.font.cardTitle.lineHeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const bottomContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: 28,
  fontSize: 24,
  letterSpacing: '-1.2px',
  marginTop: 10,
});
