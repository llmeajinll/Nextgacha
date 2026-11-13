import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnPx, btnSize, chip } from '@/styles/ui.css';

const pixel = 'silkscreen';
const { slate, color, tone } = vars;

export const form = style({ display: 'flex', flexDirection: 'column', gap: 18, color: slate[800] });

export const field = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const label = style({ fontSize: 14, fontWeight: 500 });

export const labelRow = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 14, fontWeight: 500 });

export const required = style({ color: tone.danger[1] });

export const count = style({ fontFamily: pixel, fontSize: 12, fontWeight: 400, color: slate[500] });

export const hint = style({ fontSize: 12, lineHeight: '150%', color: slate[600] });

export const errorText = style({ fontSize: 13, color: tone.danger[1] });

export const chips = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { chip } from '@/styles/ui.css';

const control = {
  boxSizing: 'border-box',
  border: `1px solid ${slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 15,
  color: slate[800],
  backgroundColor: 'white',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  selectors: {
    '&:focus': { outline: 'none', borderColor: color.blue1, boxShadow: `3px 3px 0 0 ${color.blueLight}` },
    '&::placeholder': { color: slate[500] },
  },
} as const;

export const input = style({ ...control, width: '100%', minWidth: 0, height: 44, padding: '0 12px' });

export const timeInput = style({ flex: '0 0 130px', width: 130 });

export const textarea = style({ ...control, width: '100%', minHeight: 200, padding: 12, lineHeight: '160%', resize: 'vertical' });

export const inputError = style({ borderColor: tone.danger[1] });

// 이미지 넣기: 파일 입력이 버튼 전체를 덮음
export const imageBtn = style([btn, btnSize.s, btnKind.neutral, { position: 'relative', overflow: 'hidden' }]);
export const imageBtnBusy = style({ opacity: 0.6 });

export const fileInput = style({ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' });

export const switchRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  border: `1px solid ${slate[100]}`,
  backgroundColor: slate[50],
});

export const switchText = style({ display: 'flex', flexDirection: 'column', gap: 2 });

export const whens = style({ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 });

export const whenChip = style([chip, { justifyContent: 'center' }]);

export const dates = style({ display: 'flex', gap: 8, maxWidth: 420 });

export const formError = style({ margin: 0, padding: '10px 12px', backgroundColor: tone.danger.bg, fontSize: 14, color: tone.danger[1] });

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  paddingTop: 16,
  borderTop: `1px solid ${slate[100]}`,
});

export const spacer = style({ flex: '1 1 auto' });

export const deleteBtn = style([btn, btnKind.dangerLine]);
export const neutralBtn = style([btn, btnKind.neutral]);
export const cancelBtn = style([btn, btnPx, btnKind.neutral]);
export const publishBtn = style([btn, btnPx, btnKind.primary]);
export const dangerBtn = style([btn, btnKind.danger]);

export const confirm = style({
  padding: 12,
  border: `1px solid ${tone.danger[2]}`,
  backgroundColor: tone.danger.bg,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 14,
});

export const actionsRow = style({ display: 'flex', justifyContent: 'flex-end', gap: 8 });

globalStyle(`${form} div`, { color: 'inherit' });
