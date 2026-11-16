import type { CardProps } from '@/entities/product/model/types';

export default async function getOneProduct(num: number): Promise<CardProps | null> {
  const res = await fetch(`/api/getOneProduct?num=${num}`).catch(() => null);
  if (!res?.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.result ?? null;
}
