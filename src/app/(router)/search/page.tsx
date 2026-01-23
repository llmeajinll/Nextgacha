import React from 'react';
import { Range } from '@/components/atoms';
import { Category, DetailCategory } from '@/components/molecules';
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
