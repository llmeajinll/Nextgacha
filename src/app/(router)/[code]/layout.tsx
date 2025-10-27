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
      <div
        style={{ border: '1px solid red', width: '960px', margin: '0 auto' }}
      >
        {tab}
      </div>
    </div>
  );
}
