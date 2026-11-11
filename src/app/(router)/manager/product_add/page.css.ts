import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, btnSize } from '@/styles/ui.css';

const pixel = 'silkscreen';
const danger = vars.tone.danger[1];
const tint = vars.color.blueBg;

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  color: vars.slate[800],
});

export const titleSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingBottom: 20,
  borderBottom: `1px solid ${vars.slate[200]}`,
});

export const eyebrow = style({
  fontFamily: pixel,
  fontSize: 14,
  letterSpacing: -0.7,
  color: vars.color.blue1,
});

export const title = style({
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: -1.4,
  lineHeight: '120%',
});

export const subText = style({
  margin: 0,
  fontSize: 15,
  letterSpacing: -0.5,
  color: vars.slate[600],
});

export const required = style({ color: danger });

export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 28,
  alignItems: 'flex-start',
});

export const form = style({
  flex: '999 1 520px',
  minWidth: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

// ── 섹션 패널 ──
export const panel = style({
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
});

export const panelHead = style({
  minHeight: 52,
  boxSizing: 'border-box',
  padding: '4px 20px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

export const panelTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const panelNo = style({
  fontFamily: pixel,
  fontSize: 13,
  color: vars.color.blue1,
});

export const panelTitle = style({
  margin: 0,
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: -0.8,
});

export const count = style({
  fontSize: 14,
  color: vars.slate[600],
});

export const pixelCount = style({
  fontFamily: pixel,
  fontSize: 13,
  color: vars.slate[600],
});

export const panelBody = style({
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

// 칸이 200px 아래로 줄면 다음 줄로. fieldFull은 한 줄 전체
// panelBody(세로 flex)와 같이 쓰므로 방향을 다시 지정 (이 파일에서 뒤에 정의돼 우선)
export const grid = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '18px 16px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const fieldFull = style({});

globalStyle(`${grid} > *`, { flex: '1 1 200px', minWidth: 0 });
globalStyle(`${grid} > ${fieldFull}`, { flexBasis: '100%' });

export const label = style({
  fontSize: 14,
  fontWeight: 500,
});

export const hint = style({
  margin: 0,
  fontSize: 13,
  lineHeight: '150%',
  color: vars.slate[600],
});

export const errorText = style({
  fontSize: 13,
  color: danger,
});

// ── 입력 ──
export const input = style({
  width: '100%',
  minWidth: 0,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 15,
  color: vars.slate[800],
  backgroundColor: 'white',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  selectors: {
    '&:focus': { outline: 'none', borderColor: vars.color.blue1, boxShadow: `3px 3px 0 0 ${vars.color.blueLight}` },
    '&::placeholder': { color: vars.slate[500] },
  },
});

export const inputError = style({ borderColor: danger });

export const textarea = style([input, { height: 'auto', padding: 12, lineHeight: '160%', resize: 'vertical', border: 0 }]);

// react-datepicker가 입력칸을 inline-block div로 감쌈
globalStyle(`${field} .react-datepicker-wrapper`, { width: '100%' });

// 입력칸 + 단위(원·%·개)
export const unitRow = style({ display: 'flex' });

export const unit = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 14px',
  border: `1px solid ${vars.slate[200]}`,
  borderLeft: 0,
  backgroundColor: vars.slate[100],
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  color: vars.slate[600],
});

export const salePrice = style({
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  backgroundColor: tint,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  fontWeight: 600,
  color: vars.ink[600],
});

export const saleUnit = style({ fontSize: 14, fontWeight: 400 });

// ── 그룹 칩 ──
export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

export const chip = style({
  height: 36,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  padding: '0 2px 0 12px',
  border: `1px solid ${vars.slate[200]}`,
  fontSize: 14,
  whiteSpace: 'nowrap',
});

// ── 아이콘 버튼 (ImgBtn에 입힘) ──
// 순서 바꾸기·블록 삭제·칩 빼기: ghost S 36. ImgBtn의 기본 색(blue1)을 덮으려고 색을 다시 적음
export const iconBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost, { flex: '0 0 36px', color: vars.slate[500] }]);

// 옵션 삭제처럼 칸 옆에 붙는 건 neutral M 44
export const iconBtnBox = style([
  btnSize.m,
  btnKind.neutral,
  { width: 44, height: 44, flex: '0 0 44px', border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white', color: vars.slate[700] },
]);

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

// 점선 추가 버튼 (옵션 추가, ADD TEXT/IMAGE)
export const slotBtn = style({
  minHeight: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  border: `2px dashed ${vars.color.blueLight}`,
  backgroundColor: vars.slate[50],
  color: vars.ink[400],
  fontFamily: pixel,
  fontSize: 16,
  letterSpacing: -0.8,
  cursor: 'pointer',
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

// 한글 라벨(옵션 추가)은 본문 글꼴
export const slotBtnText = style({
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 'normal',
});

globalStyle(`${slotBtn} svg`, { width: 20, height: 20, fill: 'currentColor' });

export const slotGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
});

// ── 예약 판매 ──
export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  paddingRight: 8,
  fontSize: 14,
  fontWeight: 600,
  color: vars.slate[600],
});

export const toggleOn = style({ color: vars.ink[400] });

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  backgroundColor: tint,
  color: vars.ink[700],
  fontSize: 14,
});

globalStyle(`${summary} svg`, { width: 20, height: 20, fill: vars.ink[400], flex: '0 0 auto' });

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

// ── 하단 버튼 ──
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 12,
  paddingTop: 4,
});

export const formError = style({
  marginRight: 'auto',
  padding: '10px 12px',
  fontSize: 14,
  color: danger,
  backgroundColor: vars.tone.danger.bg,
});

// ── 미리보기 ──
export const preview = style({
  flex: '1 1 300px',
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const previewHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  fontWeight: 600,
});

export const previewBox = style({
  padding: 20,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  justifyContent: 'center',
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 컨테이너 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });

// 미리보기 카드는 쇼핑몰과 같은 글자색(위 inherit 규칙보다 뒤에 둬야 이김)
globalStyle(`${previewBox} div`, { color: vars.color.black2 });
