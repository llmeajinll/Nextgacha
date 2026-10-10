import type { MetadataRoute } from 'next';
import { productColl } from '@/shared/api/mongodb';
import { baseUrl } from '@/shared/api/baseUrl';

// 상품 상세 페이지를 검색엔진에 노출 (요청 시 생성, 1시간 캐시)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await productColl
    .find({}, { projection: { _id: 0, num: 1 } })
    .toArray();

  return [
    { url: baseUrl },
    ...products.map((p) => ({ url: `${baseUrl}/${p.num}/info` })),
  ];
}
