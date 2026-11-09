'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { search, inputStyle, searchIcon } from './search.css';
import { getStandardCategory } from '@/entities/product/lib/getStandardCategory';
import { Search as SearchIcon } from 'pixelarticons/react';

export default function Search() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const searchParams = useSearchParams();
  const searchInput = searchParams.get('search');

  useEffect(() => {
    console.log('searchInput : ', searchInput);
    setKeyword(searchInput || '');
  }, []);

  return (
    <div className={search}>
      <SearchIcon width={22} height={22} className={searchIcon} aria-hidden />
      <input
        className={inputStyle}
        type='text'
        placeholder='SEARCH...'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // const target = e.target as HTMLInputElement;
            // document.location.href = `/search?search=${input}`;
            router.push(`/search?search=${keyword}&page=1`, { scroll: false });
          }
        }}
      />
    </div>
  );
}
