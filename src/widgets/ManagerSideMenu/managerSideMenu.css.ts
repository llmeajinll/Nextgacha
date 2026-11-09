import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const nav = style({
  flex: '0 0 220px',
  boxSizing: 'border-box',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  backgroundColor: vars.slate[100],
  borderRight: `1px solid ${vars.slate[200]}`,
});

export const label = style({
  fontFamily: 'silkscreen',
  fontSize: 13,
  letterSpacing: -0.4,
  color: vars.slate[600],
  padding: '0 12px 8px',
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minHeight: 44,
  padding: '0 12px',
  fontSize: 15,
  whiteSpace: 'nowrap',
  color: vars.slate[700],
  transition: 'background .15s ease, color .15s ease',
  selectors: {
    '&:hover': { backgroundColor: vars.slate[50], color: vars.slate[800] },
  },
});

export const active = style({
  fontWeight: 600,
  backgroundColor: 'white',
  color: vars.color.blue1,
  selectors: {
    '&:hover': { backgroundColor: 'white', color: vars.color.blue1 },
  },
});

// 아이콘(currentColor)은 글자보다 한 단계 옅게, 선택된 메뉴는 글자색과 같게
globalStyle(`${item} svg`, { flexShrink: 0, color: vars.slate[500], transition: 'color .15s ease' });
globalStyle(`${item}:hover svg`, { color: vars.slate[700] });
globalStyle(`${active} svg, ${active}:hover svg`, { color: 'inherit' });
