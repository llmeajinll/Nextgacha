import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { fluid, mobile } from './fluid';

// 디자인 캔버스 "태그 정리". 보통 '@/styles/ui.css'에서 같이 import한다
const pixel = 'silkscreen';
const { color, slate, tone } = vars;
const m = (n: number) => ({ '@media': { [mobile]: { fontSize: fluid(n) } } });

// ── 태그 ──
// 상태 태그: tone bg 배경 + tone 1 글자, 테두리 없음
export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 12,
  fontWeight: 600,
  padding: '4px 8px',
  whiteSpace: 'nowrap',
});
// 상품 상태처럼 목록 행의 큰 태그
export const tagL = style({ fontSize: 13, padding: '6px 10px', ...m(12) });
// 상품명 아래 제조사·카테고리·예약 기간
export const tagS = style({ padding: '4px 6px', fontWeight: 400, lineHeight: 1 });
export const tagTone = styleVariants({
  info: { backgroundColor: tone.info.bg, color: tone.info[1] },
  success: { backgroundColor: tone.success.bg, color: tone.success[1] },
  warning: { backgroundColor: tone.warning.bg, color: tone.warning[1] },
  danger: { backgroundColor: tone.danger.bg, color: tone.danger[1] },
  soldout: { backgroundColor: tone.soldout.bg, color: tone.soldout[1] },
  // 제조사
  neutral: { backgroundColor: slate[100], color: slate[700] },
  // 카테고리
  muted: { backgroundColor: slate[50], color: slate[600] },
});

// 상품·옵션 번호
export const numTag = style({
  fontFamily: pixel,
  fontSize: 12,
  padding: '2px 6px',
  backgroundColor: color.blueBg,
  color: color.blue2,
});

// 옵션 이름 + 수량
export const optionChip = style({
  height: 28,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  fontSize: 13,
  color: slate[700],
});
