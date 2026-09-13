import React from 'react';
import { emptyCard, noMarginTop } from './emptyCard.css';

export default function EmptyCard({
  children,
  noSpacing,
}: {
  children: React.ReactNode;
  noSpacing?: boolean;
}) {
  return (
    <div className={`${emptyCard} ${noSpacing ? noMarginTop : ''}`}>
      {children}
    </div>
  );
}
