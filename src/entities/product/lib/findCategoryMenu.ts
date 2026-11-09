import { categoryColl } from '@/shared/api/mongodb';
import { DEFAULT_CATEGORY_MENU } from './categoryMenu';
import type { CategoryMenu } from '../model/types';

// 헤더 카테고리 메뉴 (getCategory 라우트 + 서버 컴포넌트 공용)
// ponytail: 페이지마다 findOne 1번. 헤더 TTFB가 문제 되면 unstable_cache + postCategory에서 revalidateTag
export async function findCategoryMenu(): Promise<CategoryMenu> {
  const doc = await categoryColl.findOne({ _id: 'menu' });
  if (!doc) return DEFAULT_CATEGORY_MENU;
  return { character: doc.character, ani: doc.ani, series: doc.series, groups: doc.groups ?? [] };
}
