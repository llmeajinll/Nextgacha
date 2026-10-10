import { Suspense } from 'react';
import { ScrollToTop } from '@/shared/ui';
import ProductPurchasePanel from '@/features/purchase/ui/ProductPurchasePanel/ProductPurchasePanel';
import { DetailTab } from '@/widgets';
import { EmptyCard } from '@/shared/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { productColl } from '@/shared/api/mongodb';
import { panelWrap, tabWrap } from './layout.css';

// generateMetadata와 layout이 같은 요청에서 한 번만 조회하도록 cache
const findProduct = cache(async (code: string) => {
  const num = Number(code);
  if (!Number.isInteger(num) || num <= 0) return null;
  return productColl.findOne(
    { num },
    { projection: { _id: 0, title: 1, company: 1, image: 1 } },
  );
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const product = await findProduct((await params).code);
  if (!product) return {};
  return {
    title: product.title,
    description: `${product.company ?? ''} ${product.title}`.trim(),
    openGraph: { images: product.image },
  };
}

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
  if (!(await findProduct(code))) notFound();

  return (
    <>
      <Suspense fallback={<EmptyCard>LOADING ...</EmptyCard>}>
        <ScrollToTop />
        <div className={panelWrap}>
          <ProductPurchasePanel num={code} />
          <DetailTab />
        </div>
        {children}
        <div className={tabWrap}>{tab}</div>
      </Suspense>
    </>
  );
}
