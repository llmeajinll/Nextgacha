import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// rc-pagination 픽셀 모양. rc-pagination/assets/index.css는 import하지 않는다
export const wrap = style({ display: 'block' });

export const pagination = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 6,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

const chevron = (d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' shape-rendering='crispEdges'><path d='${d}'/></svg>`)}")`;
const LEFT = 'M8 13v-2h2v2H8Zm2-2V9h2v2h-2Zm0 4v-2h2v2h-2Zm2-6V7h2v2h-2Zm0 8v-2h2v2h-2Zm2-10V5h2v2h-2Zm0 12v-2h2v2h-2Z';
const RIGHT = 'M16 13v-2h-2v2h2Zm-2-2V9h-2v2h2Zm0 4v-2h-2v2h2Zm-2-6V7h-2v2h2Zm0 8v-2h-2v2h2ZM10 7V5H8v2h2Zm0 12v-2H8v2h2Z';

const cell = `${pagination} .rc-pagination-item, ${pagination} .rc-pagination-prev, ${pagination} .rc-pagination-next, ${pagination} .rc-pagination-jump-prev, ${pagination} .rc-pagination-jump-next`;

globalStyle(cell, {
  boxSizing: 'border-box',
  minWidth: 44,
  height: 44,
  margin: 0,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${vars.slate[200]}`,
  borderRadius: 0,
  backgroundColor: 'white',
  color: vars.slate[700],
  fontFamily: 'silkscreen',
  fontSize: 15,
  lineHeight: 1,
  listStyle: 'none',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'border-color .15s ease, background-color .15s ease',
});

globalStyle(`${pagination} .rc-pagination-item a`, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '0 12px',
  color: 'inherit',
});

globalStyle(`${pagination} .rc-pagination-item:hover, ${pagination} .rc-pagination-item:focus-visible, ${pagination} .rc-pagination-prev:not(.rc-pagination-disabled):hover, ${pagination} .rc-pagination-next:not(.rc-pagination-disabled):hover, ${pagination} .rc-pagination-jump-prev:hover, ${pagination} .rc-pagination-jump-next:hover`, {
  borderColor: vars.color.blue1,
  outline: 'none',
});

globalStyle(`${pagination} .rc-pagination-item.rc-pagination-item-active`, {
  borderColor: vars.color.blue1,
  backgroundColor: vars.color.blue1,
  color: 'white',
});

globalStyle(`${pagination} .rc-pagination-item.rc-pagination-item-active a`, { color: 'white' });

// 이전/다음: 버튼 안에 픽셀 화살표를 마스크로
globalStyle(`${pagination} .rc-pagination-item-link`, {
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
  background: 'none',
  color: 'inherit',
  cursor: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${pagination} .rc-pagination-prev .rc-pagination-item-link::after, ${pagination} .rc-pagination-next .rc-pagination-item-link::after`, {
  content: '""',
  width: 20,
  height: 20,
  backgroundColor: 'currentColor',
  maskSize: '100% 100%',
});

globalStyle(`${pagination} .rc-pagination-prev .rc-pagination-item-link::after`, { maskImage: chevron(LEFT) });
globalStyle(`${pagination} .rc-pagination-next .rc-pagination-item-link::after`, { maskImage: chevron(RIGHT) });

globalStyle(`${pagination} .rc-pagination-jump-prev .rc-pagination-item-link::after, ${pagination} .rc-pagination-jump-next .rc-pagination-item-link::after`, {
  content: '"···"',
  letterSpacing: 1,
});

globalStyle(`${pagination} .rc-pagination-prev.rc-pagination-disabled, ${pagination} .rc-pagination-next.rc-pagination-disabled`, {
  backgroundColor: vars.slate[50],
  color: vars.slate[300],
  cursor: 'default',
});
