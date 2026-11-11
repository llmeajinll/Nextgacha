import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, btnPx, btnSize, chip, chipOn, tag, tagS, tagTone } from '@/styles/ui.css';

// 제목·탭·검색·목록 틀은 상품 관리와 같다
export {
  container,
  titleText,
  eyebrow,
  title,
  subText,
  tabs,
  tab,
  tabOn,
  tabCount,
  search,
  searchInput,
  saved,
  scroll,
  empty,
  emptyTitle,
} from '../product_manage/page.css';

const pixel = 'silkscreen';
const danger = vars.tone.danger[1];

export const titleSection = style({
  paddingBottom: 20,
  borderBottom: `1px solid ${vars.slate[200]}`,
});

export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 });

export const groupDrop = style({ flex: '0 1 240px', minWidth: 180 });

export const searchGrow = style({ flex: '1 1 260px' });

export const layout = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 });

export const listCol = style({ flex: '3 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 });

export const panel = style({ border: `1px solid ${vars.slate[200]}`, backgroundColor: 'white' });

export const listHead = style({
  minHeight: 56,
  boxSizing: 'border-box',
  padding: '6px 20px 6px 8px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

export const checkLabel = style({
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
});

export const subCheckLabel = style([checkLabel, { gap: 8, paddingLeft: 8, fontWeight: 400, color: vars.slate[700] }]);

export const checkCell = style({
  width: 44,
  height: 44,
  flex: '0 0 44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export { checkbox as checkInput } from '@/styles/variants.css';

export const table = style({ minWidth: 620 });

const grid = style({
  display: 'grid',
  gridTemplateColumns: '44px minmax(220px, 1fr) 84px 64px 120px',
  alignItems: 'center',
  gap: 12,
  padding: '10px 20px 10px 8px',
});

export const head = style([
  grid,
  {
    borderBottom: `1px solid ${vars.slate[100]}`,
    backgroundColor: vars.slate[50],
    fontFamily: pixel,
    fontSize: 12,
    color: vars.slate[600],
  },
]);

export const row = style([
  grid,
  {
    minHeight: 76,
    boxSizing: 'border-box',
    borderBottom: `1px solid ${vars.slate[100]}`,
    backgroundColor: 'white',
    color: vars.slate[800],
    cursor: 'pointer',
  },
]);

export const rowOn = style({ backgroundColor: vars.color.blueTint });

export const right = style({ textAlign: 'right' });

export const product = style({ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 });

export const thumb = style({
  width: 52,
  height: 52,
  flex: '0 0 52px',
  boxSizing: 'border-box',
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: vars.slate[50],
  objectFit: 'cover',
});

export const productText = style({ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 });

export const titleLine = style({ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 });

export const num = style({ fontFamily: pixel, fontSize: 12, color: vars.slate[500] });

export const productTitle = style({
  fontSize: 15,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tags = style({ display: 'flex', flexWrap: 'wrap', gap: 4 });

export const reserveTag = style([tag, tagS, tagTone.info]);
export const discountTag = style([tag, tagS, { fontWeight: 600, backgroundColor: vars.color.blueBg, color: vars.ink[600] }]);

export const now = style({ fontSize: 14, color: vars.ink[600] });

export const muted = style({ fontSize: 14, color: vars.slate[400] });

export const after = style({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 });

export const afterNew = style({ fontSize: 15, fontWeight: 600, color: vars.ink[600] });

export const afterSub = style({ fontSize: 12, color: vars.slate[600] });

// ── 할인 패널 ──
export const side = style({
  flex: '1 1 300px',
  // 고른 상품 이름(nowrap)이 패널을 밀어 넓히지 않게
  minWidth: 0,
  maxWidth: '100%',
  position: 'sticky',
  top: 24,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  color: vars.slate[800],
});

export const sideHead = style({
  height: 52,
  boxSizing: 'border-box',
  padding: '0 20px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const sideKind = style({ fontFamily: pixel, fontSize: 14, letterSpacing: -0.5, color: vars.ink[400] });

export const sideCount = style({ fontSize: 14, color: vars.slate[600] });

export const sideBody = style({ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 });

export const field = style({ display: 'flex', flexDirection: 'column', gap: 8 });

export const label = style({ fontSize: 14, fontWeight: 500 });

export const hint = style({ fontSize: 13, fontWeight: 400, color: vars.slate[600] });

export const rateRow = style({ display: 'flex' });

export const rateInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: 50,
  boxSizing: 'border-box',
  padding: '0 14px',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  fontFamily: pixel,
  fontSize: 22,
  color: vars.slate[800],
  backgroundColor: 'white',
  selectors: {
    '&:focus': { outline: 'none', borderColor: vars.color.blue1, boxShadow: `3px 3px 0 0 ${vars.color.blueLight}` },
  },
});

export const inputError = style({ borderColor: danger });

export const unit = style({
  height: 50,
  boxSizing: 'border-box',
  padding: '0 16px',
  border: `1px solid ${vars.slate[200]}`,
  borderLeft: 0,
  backgroundColor: vars.slate[100],
  display: 'flex',
  alignItems: 'center',
  fontSize: 15,
  color: vars.slate[600],
});

export const presets = style({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 });

// 자주 쓰는 할인율은 선택 칩
export const preset = style([chip, { height: 40 }]);

export const presetOn = chipOn;

export const errorText = style({ fontSize: 13, color: danger });

export const selHead = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 });

// 모두 빼기
export const linkBtn = style([btn, btnSize.s, btnKind.text]);

export const selList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  maxHeight: 260,
  overflowY: 'auto',
  border: `1px solid ${vars.slate[100]}`,
});

export const selItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 4px 4px 12px',
  borderBottom: `1px solid ${vars.slate[100]}`,
});

export const selTitle = style({
  flex: '1 1 auto',
  minWidth: 0,
  fontSize: 13,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const selPrice = style({ fontSize: 13, color: vars.ink[600], whiteSpace: 'nowrap' });

export const removeBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost, { flex: '0 0 36px' }]);

export const selEmpty = style({
  padding: '20px 12px',
  border: `2px dashed ${vars.slate[200]}`,
  textAlign: 'center',
  fontSize: 13,
  lineHeight: '150%',
  color: vars.slate[600],
});

export const overwrite = style({
  padding: '8px 10px',
  backgroundColor: vars.tone.warning.bg,
  color: vars.tone.warning[1],
  fontSize: 13,
  lineHeight: '150%',
});

export const confirm = style({
  padding: 12,
  border: `1px solid ${vars.color.blueLight}`,
  backgroundColor: vars.slate[50],
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 14,
  lineHeight: '150%',
});

export const confirmDanger = style({ borderColor: vars.tone.danger[2] });

export const confirmBtns = style({ display: 'flex', gap: 8 });

export const ghostBtn = style([btn, btnKind.neutral, { flex: '1 1 0' }]);

export const runBtn = style([btn, btnKind.primary, { flex: '1 1 0' }]);

export const runDanger = btnKind.danger;

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingTop: 16,
  borderTop: `1px solid ${vars.slate[100]}`,
});

export const applyBtn = style([btn, btnSize.l, btnPx, btnKind.primary]);

export const clearBtn = style([btn, btnKind.dangerLine]);

export const sideError = style({
  margin: 0,
  padding: '10px 12px',
  backgroundColor: vars.tone.danger.bg,
  fontSize: 14,
  color: danger,
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 패널 안 div는 부모 색을 따르게
globalStyle(`${side} div`, { color: 'inherit' });
globalStyle(`${row} div`, { color: 'inherit' });
