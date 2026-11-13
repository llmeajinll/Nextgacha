import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate } = vars;
const onlyMobile = { display: 'none', '@media': { [mobile]: { display: 'flex' } } } as const;

export const topBar = style({
  ...onlyMobile,
  position: 'sticky',
  top: 0,
  zIndex: 5,
  height: 56,
  boxSizing: 'border-box',
  alignItems: 'center',
  padding: '0 16px',
  borderBottom: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
});

export const logo = style({ fontFamily: 'silkscreen', fontSize: fluid(20), letterSpacing: -1.1, lineHeight: 1, color: color.blue1 });

export const bottomBar = style({
  ...onlyMobile,
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 5,
  padding: '4px 4px calc(4px + env(safe-area-inset-bottom, 0px))',
  borderTop: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
});

export const tabLink = style({
  flex: '1 1 0',
  minHeight: 56,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  fontFamily: 'silkscreen',
  fontSize: fluid(10),
  letterSpacing: -0.4,
  lineHeight: 1,
  color: slate[500],
  selectors: {
    '&[aria-current="page"]': { color: color.blue1 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
});
