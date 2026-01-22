import { Suspense } from 'react';
import { ScrollToTop } from '@/components/atoms';
import { ProductPurchasePanel } from '@/components/organisms';
import { DetailTab, EmptyCard } from '@/components/molecules';
import { Metadata } from 'next';

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
      <Suspense fallback={<EmptyCard>LOADING ...</EmptyCard>}>
        <ScrollToTop />
        <div style={{ width: 'fit-content', margin: '50px auto 0 auto' }}>
          <ProductPurchasePanel num={code} />
          <DetailTab />
        </div>
        {children}
        <div
          style={{ width: '958px', margin: '0 auto', padding: '20px 0 0 0' }}
        >
          {tab}
        </div>
      </Suspense>
    </>
  );
}
