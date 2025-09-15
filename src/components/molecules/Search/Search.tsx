import React from 'react';
import { search } from './search.css';
import Image from 'next/image';

export default function Search() {
  return (
    <div className={search}>
      <Image src='/images/search.png' alt='search' width={22} height={22} />
      <input
        type='text'
        placeholder='Search...'
        style={{ outline: 'none', marginLeft: '5px', border: 'none', flex: 1 }}
      />
    </div>
  );
}
