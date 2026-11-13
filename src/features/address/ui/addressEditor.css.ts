import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import {btn, btnKind, btnSize, checkbox, mobile } from '@/styles/ui.css';
import { fluid } from '@/styles/fluid';

const { color, slate, tone } = vars;
const m = (n: number) => ({ '@media': { [mobile]: { fontSize: fluid(n) } } });

export const root = style({ display: 'flex', flexDirection: 'column', gap: 10 });
export const head = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 });
export const title = style({ fontSize: 14, fontWeight: 700, ...m(13) });
export const changeBtn = style([
  btn,
  btnSize.s,
  btnKind.text,
  { height: 28, fontSize: 12, fontWeight: 400, color: slate[400], ...m(11) },
]);

const pixelCorners =
  'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))';
export const view = style({
  padding: '12px 14px',
  backgroundColor: tone.info.bg,
  clipPath: pixelCorners,
  fontSize: 14,
  lineHeight: '160%',
  color: slate[800],
  wordBreak: 'keep-all',
  ...m(13),
});
export const empty = style({ color: slate[500] });

export const form = style({ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 });
export const field = style({ display: 'flex', flexDirection: 'column', gap: 6 });
export const label = style({ fontSize: 12, fontWeight: 600, color: slate[600], ...m(11) });
export const row = style({ display: 'flex', gap: 8 });

// 읽기 전용(검색 결과)은 회색 바탕, 직접 쓰는 칸만 흰 바탕
export const input = style({
  width: '100%',
  minWidth: 0,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${slate[200]}`,
  outline: 'none',
  backgroundColor: slate[50],
  font: 'inherit',
  fontSize: 14,
  color: slate[800],
});
export const zip = style({ width: 96, flex: '0 0 96px' });
export const editable = style({
  backgroundColor: 'white',
  selectors: {
    '&:focus': { borderColor: color.blue1, boxShadow: `3px 3px 0 0 ${color.blueLight}` },
    '&:disabled': { backgroundColor: slate[50] },
  },
});

export const searchBtn = style([btn, btnKind.neutral, { flex: '1 1 auto' }]);
export const cancelBtn = style([btn, btnKind.neutral, { flex: '1 1 0' }]);
export const saveBtn = style([btn, btnKind.primary, { flex: '1 1 0' }]);

export const check = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  color: slate[700],
  cursor: 'pointer',
  ...m(12),
});
export const box = style([checkbox, { width: 20, height: 20, flexBasis: 20 }]);

export const saved = style({ fontSize: 12, color: tone.success[2], ...m(11) });
