import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { btn, btnIcon, btnKind, btnPx, btnSize } from '@/styles/ui.css';

const pixel = 'silkscreen';
const danger = vars.tone.danger[1];

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

export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  alignItems: 'flex-start',
});

const panel = style({
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
});

export const groupPanel = style([panel, { flex: '1 1 240px', maxWidth: 300 }]);

export const itemPanel = style([panel, { flex: '999 1 520px', minWidth: 0 }]);

export const panelHead = style({
  height: 52,
  boxSizing: 'border-box',
  padding: '0 20px',
  borderBottom: `1px solid ${vars.slate[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

export const panelTitle = style({
  margin: 0,
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: -0.8,
});

export const pixelCount = style({
  fontFamily: pixel,
  fontSize: 13,
  color: vars.slate[600],
});

export const muted = style({
  fontSize: 14,
  color: vars.slate[600],
});

// ── 대분류 ──
export const groupList = style({
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

// 대분류 목록은 목록 탭
export { ltab as groupBtn, ltabOn as groupBtnActive } from '@/styles/ui.css';

export const groupName = style({ flex: '1 1 auto', textAlign: 'left' });

export const groupCount = style({
  fontFamily: pixel,
  fontSize: 12,
});

// ── 항목 ──
// 제조사가 여러 개면 묶음 사이를 패널 헤더와 같은 선으로 구분
export const sub = style({
  selectors: { '& + &': { borderTop: `1px solid ${vars.slate[200]}` } },
});

export const subBody = style({
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const subHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const subTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const makerBadge = style({
  fontFamily: pixel,
  fontSize: 11,
  padding: '3px 6px',
  backgroundColor: vars.color.blueBg,
  color: vars.color.blue1,
});

export const subTitle = style({
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

export const chip = style({
  height: 40,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  border: `1px solid ${vars.slate[200]}`,
  backgroundColor: 'white',
  fontSize: 14,
  whiteSpace: 'nowrap',
  selectors: { '&:hover': { borderColor: vars.color.blue1 } },
});

// 칩 높이를 꽉 채워서 hover 배경이 테두리에 붙게
const chipBtn = { alignSelf: 'stretch', height: 'auto' } as const;

// 항목·제조사·대분류 삭제는 ghost 아이콘 S
export const xBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost]);

export const chipXBtn = style([xBtn, chipBtn]);

// 순서 손잡이: 끌기 + 포커스 후 ←/→
export const gripBtn = style([btn, btnSize.s, btnIcon, btnKind.ghost, chipBtn, { cursor: 'grab', color: vars.slate[500] }]);

// 끌고 있는 항목 자리
export const chipDragging = style({ opacity: 0.4, borderStyle: 'dashed', borderColor: vars.color.blue1 });


export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
});

export const trashBtn = style({});

export const empty = style({
  height: 40,
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 14,
  color: vars.slate[600],
});

export const addRow = style({
  display: 'flex',
  gap: 8,
});

export const input = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: 44,
  boxSizing: 'border-box',
  padding: '0 12px',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  font: 'inherit',
  fontSize: 14,
  color: vars.slate[800],
  backgroundColor: 'white',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  selectors: {
    '&:focus': { outline: 'none', borderColor: vars.color.blue1, boxShadow: `3px 3px 0 0 ${vars.color.blueLight}` },
    '&::placeholder': { color: vars.slate[500] },
  },
});

export const inputDup = style({ borderColor: danger });

// 항목 ADD는 primary, 대분류 ADD · ADD MAKER는 secondary (모두 픽셀 라벨)
export const addBtn = style([btn, btnPx, btnKind.primary]);

export const addBtnLine = style([btn, btnPx, btnKind.secondary]);

// 대분류·항목 패널 공용: 선 → 입력칸 + ADD 순서
export const panelFoot = style({
  padding: '12px 20px',
  borderTop: `1px solid ${vars.slate[100]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

// 대분류 추가 칸
export const groupFoot = style([panelFoot, { padding: 8 }]);

export const panelNotice = style({ padding: '12px 20px 0' });

export const headRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const makerLabel = style({
  fontSize: 14,
  fontWeight: 500,
});

export const errorText = style({
  margin: 0,
  fontSize: 13,
  color: danger,
});

// theme의 globalStyle('div', { color })가 상속을 끊으므로 컨테이너 안 div는 부모 색을 따르게
globalStyle(`${container} div`, { color: 'inherit' });
