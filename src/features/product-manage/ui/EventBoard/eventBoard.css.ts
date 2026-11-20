import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { tag, tagS, tagTone } from '@/styles/ui.css';

// 탭·검색·목록 틀은 상품 관리와 같다
export {
  container,
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
} from '../productManageBoard.css';

const pixel = 'silkscreen';

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

// theme의 globalStyle('div', { color })가 상속을 끊으므로 행 안 div는 부모 색을 따르게
globalStyle(`${row} div`, { color: 'inherit' });
