'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { search, inputStyle, searchIcon } from './search.css';
import { Search as SearchIcon } from 'pixelarticons/react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');

  return (
    <form
      role='search'
      className={search}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?search=${encodeURIComponent(keyword)}&page=1`, { scroll: false });
      }}
    >
      <SearchIcon width={18} height={18} className={searchIcon} aria-hidden />
      <input
        className={inputStyle}
        type='search'
        aria-label='상품 검색'
        placeholder='상품 검색'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
      />
    </form>
  );
}
