import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const panelTitle = style({
  width: '100%',
  marginBottom: 10,
  height: 42,
  fontSize: 18,
  letterSpacing: '-0.9px',
  lineHeight: '120%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  color: vars.color.black1,
});
