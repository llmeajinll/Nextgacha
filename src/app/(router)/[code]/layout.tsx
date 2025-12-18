import React from 'react';
import { headers } from 'next/headers';
import { ProductPurchasePanel } from '@/components/organisms';
import { DetailTab } from '@/components/molecules';

export default async function DetailLayout({
  children,
  tab,
  params,
}: {
  children: React.ReactNode;
  tab: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  console.log(tab);
  // const headersList = headers();
  // const host = (await headersList).get('host');
  // const pathname = (await headersList).get('x-pathname');
  // const referer = (await headersList).get('referer');
  const { code } = await params;
  console.log(
    'getDetailProduct pathname, domainm referer params: ',

    code
  );

  return (
    <div>
      <div style={{ width: 'fit-content', margin: '50px auto 0 auto' }}>
        <ProductPurchasePanel num={code} />
        <DetailTab />
      </div>
      {children}
      <div style={{ width: '958px', margin: '0 auto', padding: '20px 0 0 0' }}>
        {tab}
      </div>
    </div>
  );
}
