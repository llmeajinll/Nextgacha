import { productColl } from '@/shared/api/mongodb';
import type { DetailBlock } from '@/entities/product/model/types';

// 상품 상세 탭의 설명 블록. 없으면 빈 배열 (예전 상품은 {num}_info.png를 씀)
export async function findProductDetail(code: string): Promise<DetailBlock[]> {
  const num = Number(code);
  if (!Number.isInteger(num) || num <= 0) return [];
  const product = await productColl.findOne({ num }, { projection: { _id: 0, detail: 1 } });
  return product?.detail ?? [];
}
