// import React, { use } from 'react';
import { headers } from 'next/headers';
import { ProductPurchasePanel } from '@/components/organisms';
import { DetailTab } from '@/components/molecules';
import ScrollToTop from '@/components/atoms/ScrollToTop';

export default async function DetailLayout({
  children,
  tab,
  params,
}: {
  children: React.ReactNode;
  tab: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <>
      <ScrollToTop />

      <div style={{ width: 'fit-content', margin: '50px auto 0 auto' }}>
        <ProductPurchasePanel num={code} />
        <DetailTab />
      </div>
      {children}
      <div style={{ width: '958px', margin: '0 auto', padding: '20px 0 0 0' }}>
        {tab}
      </div>
    </>
  );
}
