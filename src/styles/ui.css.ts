import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { fluid } from './fluid';

// 디자인 캔버스 "버튼 정리 · 탭 정리 · 태그 정리"의 규칙. 각 화면의 *.css.ts에서
// style([btn, btnSize.s, btnKind.neutral]) 처럼 조합해서 쓴다 (모서리 0, 테두리 1px)

const pixel = 'silkscreen';

// 쇼핑몰 모바일 화면 (태블릿 세로 이하)
export const mobile = 'screen and (max-width: 1023px)';
const { color, slate, tone } = vars;

// 모바일 글자 크기 (디자인 type-mobile.css)
const m = (n: number) => ({ '@media': { [mobile]: { fontSize: fluid(n) } } });

// iOS가 16px 아래 입력칸에서 화면을 확대하지 않게
globalStyle('input, textarea, select', { '@media': { [mobile]: { fontSize: 'max(16px, 1em) !important' } } });

// ── 버튼 ──
export const btn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxSizing: 'border-box',
  height: 44,
  padding: '0 16px',
  border: '1px solid transparent',
  borderRadius: 0,
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background-color .12s ease, border-color .12s ease, color .12s ease',
  selectors: {
    '&:disabled': { backgroundColor: slate[100], borderColor: slate[200], color: slate[400], cursor: 'not-allowed' },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
  ...m(13),
});

globalStyle(`${btn} svg`, { fill: 'currentColor', flex: '0 0 auto' });
globalStyle(`${btn} svg:not([width])`, { width: 16, height: 16 });

// L 50: 영역의 마지막 동작 · M 44: 기본 · S 36: 행·카드 안 동작
export const btnSize = styleVariants({
  l: { height: 50, padding: '0 20px', fontSize: 16, ...m(14) },
  m: {},
  s: { height: 36, padding: '0 12px', fontSize: 13, ...m(12) },
});

// 영문 Silkscreen 라벨 (페이지 하단 큰 버튼과 그 짝)
export const btnPx = style({
  fontFamily: pixel,
  fontWeight: 400,
  letterSpacing: -0.5,
  fontSize: 18,
  selectors: { [`&${btnSize.l}`]: { fontSize: 20 }, [`&${btnSize.s}`]: { fontSize: 15 } },
  '@media': {
    [mobile]: {
      fontSize: fluid(16),
      selectors: { [`&${btnSize.l}`]: { fontSize: fluid(17) }, [`&${btnSize.s}`]: { fontSize: fluid(14) } },
    },
  },
});

export const btnIcon = style({ width: 44, padding: 0, selectors: { [`&${btnSize.s}`]: { width: 36 } } });

export const btnBlock = style({ display: 'flex', width: '100%' });

const hover = '&:hover:not(:disabled)';
const bare = { backgroundColor: 'transparent', borderColor: 'transparent' };

export const btnKind = styleVariants({
  // 한 영역의 주요 동작, 하나만
  primary: {
    backgroundColor: color.blue1,
    borderColor: color.blue1,
    color: 'white',
    selectors: { [hover]: { backgroundColor: color.blue2, borderColor: color.blue2 } },
  },
  secondary: {
    backgroundColor: 'white',
    borderColor: color.blue1,
    color: color.blue1,
    selectors: { [hover]: { backgroundColor: tone.info.bg, borderColor: color.blue2 } },
  },
  // 취소·돌아가기·필터 해제
  neutral: {
    backgroundColor: 'white',
    borderColor: slate[200],
    color: slate[700],
    selectors: { [hover]: { backgroundColor: slate[50], borderColor: slate[300] } },
  },
  // 되돌릴 수 없는 동작
  danger: {
    backgroundColor: tone.danger[1],
    borderColor: tone.danger[1],
    color: 'white',
    selectors: { [hover]: { backgroundColor: tone.danger[2], borderColor: tone.danger[2] } },
  },
  // 위험 동작으로 들어가는 버튼
  dangerLine: {
    backgroundColor: 'white',
    borderColor: tone.danger[1],
    color: tone.danger[1],
    selectors: { [hover]: { backgroundColor: tone.danger.bg, borderColor: tone.danger[2] } },
  },
  // 카드 안 보조 링크
  text: {
    ...bare,
    padding: '0 4px',
    color: slate[600],
    selectors: {
      [hover]: { color: slate[800], textDecoration: 'underline', textUnderlineOffset: 3 },
      '&:disabled': bare,
    },
  },
  // 주문번호처럼 이동하는 값
  link: {
    ...bare,
    padding: '0 4px',
    color: color.blue1,
    selectors: {
      [hover]: { color: color.blue2, textDecoration: 'underline', textUnderlineOffset: 3 },
      '&:disabled': bare,
    },
  },
  // 배경 없는 작은 동작 (닫기, 모두 빼기)
  ghost: {
    ...bare,
    color: slate[500],
    selectors: { [hover]: { backgroundColor: slate[100], color: slate[800] }, '&:disabled': bare },
  },
});

// ── 탭 · 칩 (선택 상태는 aria-pressed="true", aria-current="page", 또는 *On 클래스) ──
const on = (cls: string) => `&${cls}, &[aria-pressed="true"], &[aria-current="page"]`;
const notOn = (cls: string) => `&:hover:not(${cls}):not([aria-pressed="true"]):not([aria-current="page"])`;
const filled = { backgroundColor: color.blue1, borderColor: color.blue1, color: 'white', fontWeight: 600 };

const countBadge = {
  minWidth: 22,
  height: 22,
  boxSizing: 'border-box',
  padding: '0 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: pixel,
  fontSize: 12,
  fontWeight: 400,
  backgroundColor: tone.soldout.bg,
  color: tone.soldout[2],
  ...m(11),
} as const;
const countOn = { backgroundColor: 'white', color: color.blue2 };

// A. 상태 탭: 목록 위 상태 필터
export const tabOn = style({});
export const tab = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  boxSizing: 'border-box',
  height: 44,
  padding: '0 14px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  color: slate[800],
  font: 'inherit',
  fontSize: 14,
  fontWeight: 400,
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background-color .12s ease, border-color .12s ease',
  selectors: {
    [notOn(tabOn)]: { backgroundColor: slate[50], borderColor: slate[300] },
    [on(tabOn)]: filled,
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
  ...m(12),
});
export const tabCount = style(countBadge);
globalStyle(`${tab}${tabOn} ${tabCount}, ${tab}[aria-pressed="true"] ${tabCount}, ${tab}[aria-current="page"] ${tabCount}`, countOn);

// B. 밑줄 탭: 같은 데이터를 다른 보기로
export const utabs = style({ display: 'flex', gap: 4, borderBottom: `1px solid ${slate[200]}` });
export const utabOn = style({});
export const utab = style({
  display: 'inline-flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  minHeight: 48,
  padding: '0 18px',
  textDecoration: 'none',
  marginBottom: -1,
  border: 0,
  borderBottom: '3px solid transparent',
  backgroundColor: 'transparent',
  color: slate[600],
  font: 'inherit',
  fontSize: 15,
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'color .12s ease, border-color .12s ease',
  selectors: {
    [notOn(utabOn)]: { color: slate[800], borderBottomColor: slate[200] },
    [on(utabOn)]: { color: slate[800], borderBottomColor: color.blue1, fontWeight: 600 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
  ...m(14),
});

// C. 선택 칩: 패널 안 작은 선택지 (할인율, 기간, 옵션)
export const chipOn = style({});
export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxSizing: 'border-box',
  height: 40,
  padding: '0 12px',
  border: `1px solid ${slate[200]}`,
  backgroundColor: 'white',
  color: slate[700],
  font: 'inherit',
  fontSize: 13,
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'background-color .12s ease, border-color .12s ease',
  selectors: {
    [notOn(chipOn)]: { backgroundColor: slate[50], borderColor: slate[300] },
    [on(chipOn)]: filled,
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
  ...m(12),
});
export const chipCount = style(countBadge);
globalStyle(`${chip}${chipOn} ${chipCount}, ${chip}[aria-pressed="true"] ${chipCount}`, countOn);

// D. 목록 탭: 세로 목록에서 하나 고르기
export const ltabOn = style({});
export const ltab = style({
  width: '100%',
  minHeight: 44,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 12px',
  border: 0,
  backgroundColor: 'transparent',
  color: slate[700],
  font: 'inherit',
  fontSize: 15,
  fontWeight: 400,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color .12s ease',
  selectors: {
    [notOn(ltabOn)]: { backgroundColor: slate[50] },
    [on(ltabOn)]: { backgroundColor: color.blueBg, color: color.blue1, fontWeight: 600 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: -2 },
  },
  ...m(14),
});

// ── 체크박스 (button role="checkbox" aria-checked, 안에 Check 아이콘) ──
export const checkbox = style({
  width: 24,
  height: 24,
  flex: '0 0 24px',
  padding: 0,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: `1px solid ${slate[300]}`,
  backgroundColor: 'white',
  color: 'white',
  selectors: {
    '&[aria-checked="true"]': { borderColor: color.blue1, backgroundColor: color.blue1 },
    '&:focus-visible': { outline: `2px solid ${color.blue2}`, outlineOffset: 2 },
  },
});

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

// ── textarea 글자 수 (칸 안 오른쪽 아래에 N/MAX) ──
// <div className={textareaBox}><textarea maxLength={MAX} /><span className={textareaCount}>{n}/{MAX}</span></div>
export const textareaBox = style({ position: 'relative', display: 'block', width: '100%' });
// 글자가 숫자 밑으로 들어가지 않게 (textarea 자체 class보다 구체적이라 padding을 이김)
globalStyle(`${textareaBox} textarea`, { display: 'block', boxSizing: 'border-box', width: '100%', paddingBottom: 28 });
export const textareaCount = style({
  position: 'absolute',
  right: 10,
  bottom: 8,
  fontSize: 12,
  lineHeight: 1,
  color: slate[500],
  pointerEvents: 'none',
});
export const textareaCountError = style({ color: tone.danger[1] });
