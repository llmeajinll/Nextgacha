import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnPx, btnSize } from '@/styles/ui.css';

const { color, slate } = vars;

// 신고 창: 버튼 왼쪽 위로 열림
export const reportWrap = style({ position: 'relative' });
export const panel = style({
  position: 'absolute',
  right: 0,
  bottom: 'calc(100% + 8px)',
  width: 'min(340px, calc(100vw - 32px))',
  boxSizing: 'border-box',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  boxShadow: `3px 3px 0 0 ${color.blueLight}`,
});
export const panelTitle = style({ fontSize: 15, fontWeight: 700, color: slate[800] });
export const panelHint = style({ fontSize: 12, color: slate[500] });
export const textarea = style({
  width: '100%',
  minHeight: 110,
  padding: 10,
  border: `1px solid ${slate[200]}`,
  font: 'inherit',
  fontSize: 14,
  resize: 'vertical',
  selectors: { '&:focus': { outline: 'none', borderColor: color.blue1 } },
});
export const sendBtn = style([btn, btnSize.s, btnPx, btnKind.primary, { alignSelf: 'flex-end' }]);
