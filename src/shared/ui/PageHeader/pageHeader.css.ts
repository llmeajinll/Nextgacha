import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const section = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 16,
  paddingBottom: 20,
  borderBottom: `1px solid ${vars.slate[200]}`,
});

export const text = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const eyebrow = style({ fontFamily: 'silkscreen', fontSize: 14, letterSpacing: -0.7, color: vars.color.blue1 });

export const title = style({ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -1.4, lineHeight: '120%' });

export const description = style({ margin: 0, fontSize: 15, letterSpacing: -0.5, color: vars.slate[600] });
