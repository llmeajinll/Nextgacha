import React from 'react';
import { vars } from '@/styles/theme.css';
import { box, machine, sparkle, sparkleLate, text } from './emptyState.css';

// 값이 없을 때 보여 주는 안내 — 빈 가챠 머신 (디자인 캔버스 가챠 머신 픽셀 아트, 돔 안을 비움)
export default function EmptyState({ children, className }: { children: React.ReactNode; className?: string }) {
  const { blue1, blue2, blueLight } = vars.color;
  return (
    <div role='status' className={`${box} ${className ?? ''}`}>
      <svg className={machine} width={64} height={88} viewBox='0 0 16 22' shapeRendering='crispEdges' aria-hidden>
        <rect x='4' y='0' width='8' height='1' fill={blue2} />
        <rect x='2' y='1' width='12' height='1' fill={blue2} />
        <rect x='1' y='2' width='14' height='7' fill={blue2} />
        <rect x='2' y='2' width='12' height='6' fill='#fff' />
        <rect x='3' y='1' width='10' height='1' fill='#fff' />
        <rect className={sparkle} x='4' y='4' width='1' height='1' fill={blueLight} />
        <rect className={sparkleLate} x='10' y='5' width='1' height='1' fill={blueLight} />
        <rect x='0' y='9' width='16' height='11' fill={blue1} />
        <rect x='2' y='11' width='12' height='1' fill={blueLight} />
        <rect x='6' y='13' width='4' height='4' fill='#fff' />
        <rect x='7' y='14' width='2' height='2' fill={blue2} />
        <rect x='11' y='16' width='3' height='3' fill={blue2} />
        <rect x='12' y='17' width='1' height='1' fill='#fff' />
        <rect x='1' y='20' width='4' height='2' fill={blue2} />
        <rect x='11' y='20' width='4' height='2' fill={blue2} />
      </svg>
      <p className={text}>{children}</p>
    </div>
  );
}
