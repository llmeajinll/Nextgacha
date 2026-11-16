import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, btnSize } from '@/styles/ui.css';

export const chip = style({
  height: 38,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  fontSize: 14,
  color: vars.slate[800],
  whiteSpace: 'nowrap',
  transition: 'border-color .15s ease',
  selectors: {
    '&:hover': { borderColor: vars.color.blue1 },
  },
});

export const chipWithGrip = style({
  paddingLeft: 0,
});

export const chipWithoutGrip = style({
  paddingLeft: 12,
});

export const chipDragging = style({
  opacity: 0.4,
  borderStyle: 'dashed',
  borderColor: vars.color.blue1,
});

export const label = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0 4px',
});

const chipBtnBase = {
  alignSelf: 'stretch',
  height: 'auto',
  borderRadius: 0,
} as const;

export const gripBtn = style([
  btn,
  btnSize.s,
  btnIcon,
  btnKind.ghost,
  chipBtnBase,
  {
    cursor: 'grab',
    color: vars.slate[500],
    padding: '0 8px',
  },
]);

export const removeBtn = style([
  btn,
  btnSize.s,
  btnIcon,
  btnKind.ghost,
  chipBtnBase,
  {
    color: vars.slate[500],
    padding: '0 8px',
  },
]);
