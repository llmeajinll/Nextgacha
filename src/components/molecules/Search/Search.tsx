'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { search } from './search.css';
import Image from 'next/image';

export default function Search() {
  const router = useRouter();
  const [input, setInput] = useState('');
  return (
    <div className={search}>
      <Image src='/images/search.png' alt='search' width={22} height={22} />
      <input
        type='text'
        placeholder='SEARCH...'
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // const target = e.target as HTMLInputElement;
            // document.location.href = `/search?search=${input}`;
            router.replace(`/search?search=${input}`, { scroll: false });
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
