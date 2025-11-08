'use client';

import React, { useState } from 'react';
import { search } from './search.css';
import Image from 'next/image';

export default function Search() {
  const [input, setInput] = useState('');
  return (
    <div className={search}>
      <Image src='/images/search.png' alt='search' width={22} height={22} />
      <input
        type='text'
        placeholder='Search...'
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // const target = e.target as HTMLInputElement;
            document.location.href = `/search?search=${input}`;
          }
        }}
        style={{ outline: 'none', marginLeft: '5px', border: 'none', flex: 1 }}
      />
    </div>
  );
}
