import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 이미지 업로드·상세 블록은 공용 폼 스타일 위에 얹는다 (컴포넌트는 이 파일 하나만 import)
export * from './productForm.css';

const pixel = 'silkscreen';
const tint = vars.color.blueBg;
const danger = vars.tone.danger[1];

// ── 이미지 업로드 ──
// 파일 입력이 영역 전체를 덮어서 끌어다 놓기가 브라우저 기본 동작으로 됨
export const dropzone = style({
  position: 'relative',
  minHeight: 150,
  boxSizing: 'border-box',
  padding: 20,
  border: `2px dashed ${vars.color.blueLight}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  textAlign: 'center',
  cursor: 'pointer',
  selectors: {
    '&:hover, &:focus-within': { borderColor: vars.color.blue1 },
  },
});

export const dropzoneError = style({ borderColor: danger });

export const fileInput = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
});

export const dropIcon = style({
  width: 48,
  height: 48,
  backgroundColor: tint,
  color: vars.ink[400],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${dropIcon} svg`, { width: 24, height: 24, fill: 'currentColor' });

export const dropTitle = style({ fontSize: 15, fontWeight: 500 });

export const link = style({ color: vars.ink[500], textDecoration: 'underline' });

export const thumbs = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: 10,
});

export const thumb = style({
  position: 'relative',
  aspectRatio: '1',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.slate[500],
});

export const thumbMain = style({ borderColor: vars.color.blue1, backgroundColor: vars.slate[100] });

globalStyle(`${thumb} > svg`, { width: 24, height: 24, fill: 'currentColor' });

export const thumbImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const mainBadge = style({
  position: 'absolute',
  left: 0,
  top: 0,
  padding: '4px 6px',
  fontFamily: pixel,
  fontSize: 11,
  lineHeight: 1,
  backgroundColor: vars.ink[500],
  color: 'white',
});

// ── 상세 설명 블록 ──
export const block = style({ border: `1px solid ${vars.slate[200]}` });

export const blockHead = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 4px 0 12px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const blockKind = style({
  fontFamily: pixel,
  fontSize: 13,
  color: vars.ink[400],
});

export const blockTools = style({ display: 'flex', alignItems: 'center' });

export const blockDrop = style([dropzone, { margin: 12, minHeight: 180, padding: 16, gap: 8 }]);

export const blockDropIcon = style({ width: 44, height: 44 });

export const blockDropTitle = style({ fontSize: 14, fontWeight: 500 });

export const blockDropHint = style({ fontSize: 12, color: vars.slate[600] });

export const thumbDelete = style({
  position: 'absolute',
  right: 2,
  top: 2,
  zIndex: 2,
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
  },
});

export const blockPreview = style({
  margin: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'center',
  padding: 12,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
});

export const blockPreviewImg = style({
  maxWidth: '100%',
  height: 'auto',
  maxHeight: 300,
  objectFit: 'contain',
});
