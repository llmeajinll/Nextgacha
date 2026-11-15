import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const footer = style({
  marginTop: 80,
  padding: '24px 16px 96px',
  borderTop: `1px solid ${vars.slate[200]}`,
  textAlign: 'center',
  fontSize: 13,
  color: vars.slate[600],
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const notice = style({ fontWeight: 500 });
