import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const bob = keyframes({ '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } });
const blink = keyframes({ '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } });

export const box = style({
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 200,
  padding: '24px 16px',
  border: `2px dashed ${vars.slate[200]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 14,
  color: vars.slate[500],
});

export const machine = style({
  '@media': { '(prefers-reduced-motion: no-preference)': { animation: `${bob} 1.2s steps(2) infinite` } },
});

export const sparkle = style({
  '@media': { '(prefers-reduced-motion: no-preference)': { animation: `${blink} 1s steps(1) infinite` } },
});

export const sparkleLate = style([sparkle, { animationDelay: '.5s' }]);

export const text = style({ margin: 0, fontSize: 15, lineHeight: '150%', textAlign: 'center', wordBreak: 'keep-all' });
