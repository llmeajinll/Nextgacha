import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const { slate, tone, color } = vars;

export const wrap = style({ position: 'relative', display: 'flex', alignItems: 'center' });

export const bell = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: slate[600],
  cursor: 'pointer',
  selectors: { '&:hover': { color: slate[800] } },
});

export const badge = style({
  position: 'absolute',
  top: 4,
  right: 2,
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  boxSizing: 'border-box',
  backgroundColor: tone.danger[1],
  color: 'white',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '18px',
  textAlign: 'center',
});

export const panel = style({
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 30,
  width: 320,
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 400,
  overflowY: 'auto',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  boxShadow: `4px 4px 0 0 ${color.blueLight}`,
});

export const item = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '12px 14px',
  borderBottom: `1px solid ${slate[100]}`,
  fontSize: 14,
  lineHeight: '150%',
  color: slate[800],
  selectors: { '&:hover': { backgroundColor: slate[50] } },
});

export const itemNew = style({ backgroundColor: tone.info.bg });

export const date = style({ fontSize: 12, color: slate[600] });

export const empty = style({ margin: 0, padding: '24px 14px', textAlign: 'center', fontSize: 14, color: slate[600] });
