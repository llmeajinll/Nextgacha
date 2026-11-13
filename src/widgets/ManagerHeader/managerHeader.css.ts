import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 스크롤해도 화면 위에 남는다: Drawer·사이드 메뉴·이벤트 패널이 이 60px 아래를 기준으로 붙는다
export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  height: 60,
  boxSizing: 'border-box',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  backgroundColor: 'white',
  borderBottom: `1px solid ${vars.slate[200]}`,
  fontFamily: 'silkscreen',
});

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: 24,
  letterSpacing: -1.2,
  lineHeight: 1,
  color: vars.slate[800],
});

export const badge = style({
  fontSize: 13,
  letterSpacing: -0.4,
  lineHeight: 1,
  padding: '5px 8px',
  backgroundColor: vars.color.blueBg,
  color: vars.color.blue1,
});

export const shop = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 44,
  fontSize: 14,
  letterSpacing: -0.7,
  color: vars.slate[600],
  selectors: { '&:hover': { color: vars.ink[500] } },
});
