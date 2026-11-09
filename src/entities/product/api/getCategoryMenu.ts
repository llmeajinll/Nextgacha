import type { CategoryMenu } from '../model/types';

export default async function getCategoryMenu(): Promise<CategoryMenu> {
  const res = await fetch('/api/getCategory');
  if (!res.ok) throw new Error('카테고리 조회 실패');
  return (await res.json()).menu;
}
