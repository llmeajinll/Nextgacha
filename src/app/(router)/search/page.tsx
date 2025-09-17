import React from 'react';
import { Category } from '@/components/atoms';
import { SearchPage } from '@/components/pages';

export default function page() {
  return (
    <div>
      <Category status='menu' />
      <SearchPage />
    </div>
  );
}
