import type { ProductEvent } from '@/entities/product/lib/parseProductForm';

// discount 0이면 할인을 내린다
export default async function postEvent(event: ProductEvent): Promise<void> {
  const res = await fetch('/api/postEvent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message ?? '반영하지 못했어요.');
}
