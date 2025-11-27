import React from 'react';
import { DetailTemplate } from '@/components/templates';

export default function DetailLayout({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: React.ReactNode;
}) {
  console.log(tab);
  return (
    <div>
      <DetailTemplate />
      {children}
      <div style={{ width: '958px', margin: '0 auto' }}>{tab}</div>
    </div>
  );
}
