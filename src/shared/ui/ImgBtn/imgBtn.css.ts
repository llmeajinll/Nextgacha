import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const imgBtn = style({
  width: '100%',
  height: '60px',
  fontSize: '20px',
  lineHeight: '60px',
  textAlign: 'center',
  borderTop: `1px solid ${vars.color.gray1}`,
  marginTop: '15px',
});

// 픽셀 아이콘 버튼 (아이콘은 currentColor로 그려짐)
export const imgBtnBase = style({
  display: 'inline-flex',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: vars.color.blue1,
  selectors: { '&:disabled': { cursor: 'default', color: vars.slate[300] } },
});

export const iconOn = style({ color: vars.color.blue1 });
export const iconOff = style({ color: vars.slate[300] });
