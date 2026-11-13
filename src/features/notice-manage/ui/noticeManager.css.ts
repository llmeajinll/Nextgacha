import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnKind, btnPx, btnSize, tag, tagTone } from '@/styles/ui.css';
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

// ── 거르기 ──
export const filters = style({ display: 'flex', flexDirection: 'column', gap: 12 });

export const toolbar = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 });

export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export { tab, tabCount, chip, chipCount } from '@/styles/ui.css';

export const chips = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

export const search = style([searchField, { flex: '0 1 300px', minWidth: 200 }]);

export { searchFieldInput as searchInput } from '@/styles/variants.css';

export const layout = style({ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' });

// ── 목록 ──
export const listCol = style({ flex: '999 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 });

export const panel = style({ border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const scroll = style({ overflowX: 'auto' });

export const table = style({ minWidth: 520 });

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '32px 64px minmax(0, 1fr) 76px 92px',
  alignItems: 'center',
  gap: 10,
  padding: '0 16px 0 8px',
});

export const head = style({ height: 40, borderBottom: `1px solid ${slate[200]}`, backgroundColor: slate[50], fontSize: 13, color: slate[600] });

export const row = style({
  width: '100%',
  minHeight: 64,
  boxSizing: 'border-box',
  border: 0,
  borderBottom: `1px solid ${slate[100]}`,
  backgroundColor: 'white',
  font: 'inherit',
  textAlign: 'left',
  color: slate[800],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: slate[25] },
    '&[aria-pressed="true"]': { backgroundColor: color.blueTint2, boxShadow: `inset 4px 0 0 0 ${color.blue1}` },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
});

export const center = style({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 });

export const pinCell = style({ display: 'flex', justifyContent: 'center', color: color.blue1 });

globalStyle(`${pinCell} svg`, { width: 18, height: 18, fill: 'currentColor' });

export const titleCell = style({ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 });

export const rowTitle = style({ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

export const rowTitleBold = style({ fontWeight: 700 });

export const rowPreview = style({ fontSize: 12, color: slate[500], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

export const date = style({ fontSize: 13, color: slate[600] });

export const time = style({ fontSize: 11, color: slate[500] });

export const catTag = styleVariants({
  notice: [tag, tagTone.info],
  ship: [tag, tagTone.warning],
  event: [tag, tagTone.success],
  check: [tag, tagTone.danger],
});

export const statusTag = styleVariants({
  live: [tag, tagTone.success],
  soon: [tag, tagTone.info],
  draft: [tag, tagTone.soldout],
});

export const empty = style({ padding: '40px 20px', textAlign: 'center', fontSize: 14, color: slate[600] });

export const listFoot = style({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 });

export const muted = style({ fontSize: 13, color: slate[600] });

// ── 수정 패널 ──
export const editor = style({ flex: '1 1 400px', minWidth: 0, maxWidth: 520, border: `1px solid ${slate[200]}`, backgroundColor: 'white' });

export const noPick = style({ padding: '48px 20px', textAlign: 'center', fontSize: 14, lineHeight: '150%', color: slate[600] });

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

export const editorBody = style({ padding: 20 });

globalStyle(`${container} div`, { color: 'inherit' });
