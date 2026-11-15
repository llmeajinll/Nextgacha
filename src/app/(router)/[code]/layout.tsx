import { Suspense } from 'react';
import { ScrollToTop } from '@/shared/ui';
import ProductPurchasePanel from '@/features/purchase/ui/ProductPurchasePanel/ProductPurchasePanel';
import { DetailTab } from '@/widgets';
import { EmptyCard } from '@/shared/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { productColl } from '@/shared/api/mongodb';
import { saleState } from '@/entities/product/lib/salePolicy';
import { panelWrap, tabWrap } from './layout.css';

// generateMetadata와 layout이 같은 요청에서 한 번만 조회하도록 cache
const findProduct = cache(async (code: string) => {
  const num = Number(code);
  if (!Number.isInteger(num) || num <= 0) return null;
  return productColl.findOne(
    { num },
    { projection: { _id: 0, title: 1, company: 1, image: 1, reserveStart: 1, reserveEnd: 1 } },
  );
});

// Next가 만드는 타입 검사는 generateMetadata도 layout과 같은 props(@tab 슬롯 포함)를 받는다고 본다
type Props = {
  children: React.ReactNode;
  tab: React.ReactNode;
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await findProduct((await params).code);
  if (!product) return {};
  return {
    title: product.title,
    description: `${product.company ?? ''} ${product.title}`.trim(),
    openGraph: { images: product.image },
  };
}

export default async function DetailLayout({ children, tab, params }: Props) {
  const { code } = await params;
  const product = await findProduct(code);
  // 예약 마감 후 2주는 상세도 숨긴다 (preorders.md)
  if (!product || saleState(product) === 'hidden') notFound();

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
