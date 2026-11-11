import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, btnPx, btnSize, tag, tagTone } from '@/styles/ui.css';
import { searchField } from '@/styles/variants.css';

const pixel = 'silkscreen';
const { slate, color, tone } = vars;

export const container = style({ display: 'flex', flexDirection: 'column', gap: 24, color: slate[800] });

// ── 제목 ──
export const titleSection = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 16,
  paddingBottom: 20,
  borderBottom: `1px solid ${slate[200]}`,
});

export const titleText = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const eyebrow = style({ fontFamily: pixel, fontSize: 14, letterSpacing: -0.7, color: color.blue1 });

export const title = style({ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -1.4, lineHeight: '120%' });

export const subText = style({ margin: 0, fontSize: 15, letterSpacing: -0.5, color: slate[600] });

export const addBtn = style([btn, btnSize.l, btnPx, btnKind.primary]);

export const toast = style({ padding: '12px 16px', backgroundColor: tone.success.bg, color: slate[800], fontSize: 14 });

// ── 도구 ──
export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 });

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { tab, tabCount } from '@/styles/ui.css';

export const search = style([searchField, { flex: '0 1 280px', minWidth: 200 }]);

export { searchFieldInput as searchInput } from '@/styles/variants.css';

export const layout = style({ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' });

// ── 목록 ──
export const listCol = style({ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 });

export const panel = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const panelHead = style({
  minHeight: 48,
  boxSizing: 'border-box',
  padding: '0 16px',
  borderBottom: `1px solid ${slate[200]}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const muted = style({ fontSize: 13, color: slate[600] });

export const hint = style({ fontSize: 12, color: slate[500] });

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 8px 10px 16px',
  borderBottom: `1px solid ${slate[100]}`,
  selectors: { '&:hover': { backgroundColor: slate[25] } },
});

export const rowOn = style({
  backgroundColor: color.blueTint2,
  boxShadow: `inset 4px 0 0 0 ${color.blue1}`,
  selectors: { '&:hover': { backgroundColor: color.blueTint2 } },
});

export const no = style({ width: 28, flex: '0 0 28px', fontFamily: pixel, fontSize: 13, color: slate[500] });

export const pick = style({
  flex: '1 1 auto',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  font: 'inherit',
  textAlign: 'left',
  color: slate[800],
  cursor: 'pointer',
  selectors: { '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 } },
});

export const thumb = style({
  width: 112,
  height: 37,
  flex: '0 0 112px',
  boxSizing: 'border-box',
  border: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  objectFit: 'cover',
});

export const dim = style({ opacity: 0.5 });

export const rowText = style({ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 });

export const rowTitleLine = style({ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 });

export const rowTitle = style({ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

export const rowLink = style({ fontSize: 12, color: slate[500], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

export const statusTag = styleVariants({
  live: [tag, tagTone.success],
  soon: [tag, tagTone.info],
  hidden: [tag, tagTone.soldout],
  ended: [tag, tagTone.muted],
});

export const draftTag = style([tag, tagTone.warning]);

export const orderBtns = style({ display: 'flex', flexDirection: 'column' });

export const iconBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost]);

export const empty = style({ padding: '40px 20px', textAlign: 'center', fontSize: 14, color: slate[600] });

// ── 수정 패널 ──
export const editor = style({
  flex: '1 1 400px',
  minWidth: 0,
  maxWidth: 520,
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
});

export const noPick = style({ padding: '48px 20px', textAlign: 'center', fontSize: 14, color: slate[600] });

export const editorHead = style({
  height: 52,
  boxSizing: 'border-box',
  padding: '0 20px',
  borderBottom: `1px solid ${slate[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const editorTitle = style({ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.8 });

export const editorBody = style({ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 });

export const preview = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '1312 / 439',
  boxSizing: 'border-box',
  border: `1px solid ${slate[200]}`,
  backgroundColor: slate[50],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const previewImg = style({ objectFit: 'cover' });

export const previewEmpty = style({ fontSize: 16, fontWeight: 700, letterSpacing: -0.8, color: slate[500] });

export const sizeText = style({
  position: 'absolute',
  right: 8,
  bottom: 8,
  padding: '2px 6px',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  fontFamily: pixel,
  fontSize: 11,
  color: slate[600],
});

// 점선 칸 (상품 추가의 이미지 올리기와 같은 패턴). 파일 입력이 칸 전체를 덮음
export const slot = style({
  position: 'relative',
  minHeight: 76,
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: `2px dashed ${color.blueLight}`,
  backgroundColor: slate[50],
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  cursor: 'pointer',
  selectors: { '&:hover, &:focus-within': { borderColor: color.blue1 } },
});

export const slotError = style({ borderColor: tone.danger[1] });

export const slotKind = style({ display: 'flex', alignItems: 'center', gap: 6, fontFamily: pixel, fontSize: 12, color: color.blue1 });

globalStyle(`${slotKind} svg`, { width: 16, height: 16, fill: 'currentColor' });

export const slotFile = style({ fontSize: 13, wordBreak: 'break-all' });

export const fileInput = style({ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' });

export const field = style({ display: 'flex', flexDirection: 'column', gap: 6 });

export const label = style({ fontSize: 14, fontWeight: 500 });

export const required = style({ color: tone.danger[1] });

export const input = style({
  width: '100%',
  minWidth: 0,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
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
    '&:disabled': { backgroundColor: slate[100], color: slate[400] },
  },
});

export const inputError = style({ borderColor: tone.danger[1] });

export const errorText = style({ fontSize: 13, color: tone.danger[1] });

export const dates = style({ display: 'flex', alignItems: 'center', gap: 8 });

export const checkLabel = style({ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 32, fontSize: 14, color: slate[700], cursor: 'pointer' });

export const visibleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  border: `1px solid ${slate[100]}`,
  backgroundColor: slate[50],
});

export const visibleText = style({ display: 'flex', flexDirection: 'column', gap: 2 });

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
export const cancelBtn = style([btn, btnPx, btnKind.neutral]);
export const saveBtn = style([btn, btnPx, btnKind.primary]);

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

export const neutralBtn = style([btn, btnKind.neutral]);
export const dangerBtn = style([btn, btnKind.danger]);

// theme의 globalStyle('div', { color })가 상속을 끊으므로 안쪽 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
