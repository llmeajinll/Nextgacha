import type { CategoryMenu } from '@/entities/product/model/types';

export default async function postCategoryMenu(menu: CategoryMenu): Promise<void> {
  const res = await fetch('/api/postCategory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  });
  if (!res.ok) throw new Error('카테고리 저장 실패');
}
