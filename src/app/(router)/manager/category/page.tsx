import { findCategoryMenu } from '@/entities/product/lib/findCategoryMenu';
import CategoryManager from '@/features/category-manage/ui/CategoryManager';

export default async function Page() {
  return <CategoryManager initial={await findCategoryMenu()} />;
}
