import * as s from './reviewBoard.css';

// 꽉 찬 픽셀 별 (pixelarticons Star는 테두리만 있어서 채움색이 안 보임). 디자인 "상태 바 정리 · 별점"과 같은 모양
const STAR_PATH =
  'M10 0h4v4h-4zM8 4h8v4h-8zM0 8h24v2h-24zM2 10h20v2h-20zM4 12h16v2h-16zM6 14h12v2h-12zM4 16h16v2h-16zM4 18h6v2h-6zM14 18h6v2h-6zM2 20h6v2h-6zM16 20h6v2h-6zM2 22h4v2h-4zM18 22h4v2h-4z';

// 픽셀 별 5개. 1~2점은 빨강
export default function Stars({ value, size }: { value: number; size: number }) {
  const n = Math.round(value);
  const low = n > 0 && n <= 2;
  return (
    <span role='img' aria-label={`5점 만점에 ${value.toFixed(1)}점`} className={s.stars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox='0 0 24 24'
          shapeRendering='crispEdges'
          aria-hidden
          className={s.star[i < n ? (low ? 'low' : 'on') : low ? 'lowOff' : 'off']}
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}
