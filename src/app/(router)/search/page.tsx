import React from 'react';
import { Range } from '@/shared/ui';
import { Category, DetailCategory } from '@/entities/product/ui';
import { SearchPage } from '@/views';
import { findCategoryMenu } from '@/entities/product/lib/findCategoryMenu';

export default async function Page() {
  return (
    <Range preset='column' gap='15'>
      <Category status='menu' menu={await findCategoryMenu()} />
      <DetailCategory />
      <SearchPage />
    </Range>
  );
}
