'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { search } from './search.css';
import { getStandardCategory } from '@/shared/getStandardCategory';
import Image from 'next/image';

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
      <Image src='/images/search.png' alt='search' width={22} height={22} />
      <input
        type='text'
        placeholder='SEARCH...'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // const target = e.target as HTMLInputElement;
            // document.location.href = `/search?search=${input}`;
            router.push(`/search?search=${keyword}`, { scroll: false });
          }
        }}
        style={{
          outline: 'none',
          marginLeft: '5px',
          border: 'none',
          flex: 1,
          fontFamily: 'silkscreen',
          lineHeight: '21px',
        }}
      />
    </div>
  );
}
