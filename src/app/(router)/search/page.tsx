import React from 'react';
import { Range } from '@/shared/ui';
import { Category, DetailCategory } from '@/entities/product/ui';
import { SearchPage } from '@/components/pages';

export default function page() {
  return (
    <Range preset='column' gap='15'>
      <Category status='menu' />
      <DetailCategory />
      <SearchPage />
    </Range>
  );
}
