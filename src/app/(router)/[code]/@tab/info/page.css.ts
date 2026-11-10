import { style } from '@vanilla-extract/css';

export const detailText = style({
  margin: '0 0 20px',
  fontSize: 16,
  lineHeight: '160%',
  whiteSpace: 'pre-wrap',
});

// 세로로 긴 이미지도 비율 그대로
export const detailImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
});
