import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const dropdownWrapper = style({
  position: 'relative',
  width: '100%',
});

export const dropdownContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  boxSizing: 'border-box',
  width: '100%',
  height: 44,
  padding: '0 16px 0 12px',
  border: `1px solid ${vars.color.gray1}`,
  backgroundColor: 'white',
  font: 'inherit',
  fontSize: 16,
  color: vars.color.black1,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': { outline: `2px solid ${vars.color.blue1}`, outlineOffset: -2 },
  },
});

export const dropdownTitle = style({
  flex: '1 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const arrow = style({ flex: '0 0 auto' });

export const listContainer = style({
  position: 'absolute',
  zIndex: 10,
  boxSizing: 'border-box',
  width: '100%',
  maxHeight: 320,
  overflowY: 'auto',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  backgroundColor: 'white',
  border: `1px solid ${vars.color.gray1}`,
  borderTop: 0,
});

export const listStyle = style({
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  padding: '0 16px 0 12px',
  border: 0,
  backgroundColor: 'white',
  font: 'inherit',
  fontSize: 16,
  lineHeight: '44px',
  color: vars.color.black1,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover, &:focus-visible': { outline: 'none', backgroundColor: '#F1F1F1' },
  },
});

export const groupLabel = style({
  padding: '8px 12px 4px',
  fontSize: 13,
  color: vars.slate[600],
});
