import { Truck } from 'pixelarticons/react';
import { vars } from '@/styles/theme.css';
import * as s from './cartCheckout.css';

// 배송지 위 픽셀 길 장식 (나무·건물 위치는 디자인 캔버스 MyCart 그대로)
const TREE = { w: 10, h: 14, vb: '0 0 5 7' };
const ROAD = [
  { at: 14, kind: 'tree' },
  { at: 30, kind: 'tall' },
  { at: 38, kind: 'small' },
  { at: 56, kind: 'tree' },
  { at: 64, kind: 'tree' },
  { at: 78, kind: 'mid' },
  { at: 92, kind: 'tree' },
] as const;
const TREE_FILL = vars.tone.success[1];
const BUILDING = { tall: [5, 10], small: [4, 7], mid: [5, 9] } as const;

function Deco({ kind }: { kind: (typeof ROAD)[number]['kind'] }) {
  if (kind === 'tree') {
    return (
      <svg width={TREE.w} height={TREE.h} viewBox={TREE.vb} shapeRendering='crispEdges'>
        <rect x='1' width='3' height='1' fill={TREE_FILL} />
        <rect y='1' width='5' height='3' fill={TREE_FILL} />
        <rect x='1' y='4' width='3' height='1' fill={TREE_FILL} />
        <rect x='2' y='5' width='1' height='2' fill={vars.slate[400]} />
      </svg>
    );
  }
  const [w, h] = BUILDING[kind];
  const windows = [];
  for (let y = 1; y < h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) windows.push(<rect key={`${x}${y}`} x={x} y={y} width='1' height='1' fill='white' />);
  return (
    <svg width={w * 2} height={h * 2} viewBox={`0 0 ${w} ${h}`} shapeRendering='crispEdges'>
      <rect width={w} height={h} fill={vars.slate[200]} />
      {windows}
    </svg>
  );
}

// 배송지 칸 아래에서 트럭이 지나가는 픽셀 길
export default function RoadDeco() {
  return (
    <div aria-hidden className={s.road}>
      <div className={s.scenery}>
        {[0, 1].map((tile) => (
          <span key={tile} className={s.sceneryTile}>
            {ROAD.map((d) => (
              <span key={d.at} className={`${s.roadDeco} ${s.roadAt[d.at]}`}>
                <Deco kind={d.kind} />
              </span>
            ))}
            <span className={s.roadLine} />
          </span>
        ))}
      </div>
      <span className={s.truckDrive}>
        <Truck width={16} height={16} className={s.truck} />
      </span>
    </div>
  );
}
