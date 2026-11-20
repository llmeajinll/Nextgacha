'use client';

import { useAtomValue } from 'jotai';
import { CardGrid } from '@/entities/product/ui';
import { searchProductsAtom } from '@/entities/product/model/store';
import { Range, ScrollToTop } from '@/shared/ui';
import { noProductContainer, pageWrap } from './searchResults.css';

export default function SearchResults() {
  const searchProducts = useAtomValue(searchProductsAtom);

  return (
    <div className={pageWrap}>
      <ScrollToTop />
      {searchProducts && searchProducts.length === 0 ? (
        <Range width='full' className={noProductContainer}>
          NO RESULT :{'('}
        </Range>
      ) : (
        <CardGrid items={searchProducts} />
      )}
    </div>
  );
}
