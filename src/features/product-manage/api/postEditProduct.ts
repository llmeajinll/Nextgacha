import type { ProductEdit } from '@/entities/product/lib/parseProductForm';

export default async function postEditProduct(edit: ProductEdit): Promise<void> {
  const res = await fetch('/api/postEditProduct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(edit),
  });
  if (!res.ok) throw new Error('상품 수정 실패');
}
