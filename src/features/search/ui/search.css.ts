import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const { color, slate } = vars;

export const search = style({
  flex: '0 1 280px',
  minWidth: 180,
  height: 40,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  margin: 0,
  padding: '0 12px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  color: slate[500],
  selectors: {
    '&:focus-within': { borderColor: color.blue1, backgroundColor: 'white', boxShadow: `3px 3px 0 0 ${color.blueLight}` },
  },
});

export const inputStyle = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: '100%',
  border: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  font: 'inherit',
  fontSize: 14,
  color: slate[800],
});

export const searchIcon = style({ flex: '0 0 auto' });
