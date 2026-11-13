import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnSize } from '@/styles/ui.css';

const { slate, color, tone } = vars;

export const container = style({ display: 'flex', flexDirection: 'column', gap: 24, color: slate[800], maxWidth: 820 });

export const titleSection = style({ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 20, borderBottom: `1px solid ${slate[200]}` });

export const back = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  minHeight: 32,
  fontSize: 14,
  color: slate[600],
  selectors: { '&:hover': { color: slate[800] } },
});

globalStyle(`${back} svg`, { width: 20, height: 20, fill: 'currentColor' });

export const eyebrow = style({ fontFamily: 'silkscreen', fontSize: 14, letterSpacing: -0.7, color: color.blue1 });

export const title = style({ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -1.4, lineHeight: '120%' });

export const subText = style({ margin: 0, fontSize: 15, letterSpacing: -0.5, color: slate[600] });

export const panel = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white', padding: 24 });

export const done = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 16px',
  border: `1px solid ${tone.success[2]}`,
  backgroundColor: tone.success.bg,
});

export const doneText = style({ fontSize: 14, fontWeight: 600 });

export const doneBtns = style({ display: 'flex', gap: 8 });

export const neutralBtn = style([btn, btnSize.s, btnKind.neutral]);
export const secondaryBtn = style([btn, btnSize.s, btnKind.secondary]);
