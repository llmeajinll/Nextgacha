import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 옵션 칸은 공용 폼 스타일 위에 얹는다 (컴포넌트는 이 파일 하나만 import)
export * from './productForm.css';

const pixel = 'silkscreen';
const tint = vars.color.blueBg;

// ── 상품 옵션 ──
export const optionHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontFamily: pixel,
  fontSize: 12,
  color: vars.slate[600],
});

export const optionRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const optionNo = style({
  width: 36,
  height: 36,
  flex: '0 0 36px',
  backgroundColor: tint,
  color: vars.ink[500],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: pixel,
  fontSize: 13,
});

export const optionHeadNo = style({ width: 36, flex: '0 0 36px', textAlign: 'center' });

export const optionHeadTool = style({ width: 44, flex: '0 0 44px' });

export const optionName = style({ flex: '1 1 auto', minWidth: 0 });

export const optionQty = style({ width: 150, flex: '0 0 150px' });

export const optionError = style({ paddingLeft: 46 });
