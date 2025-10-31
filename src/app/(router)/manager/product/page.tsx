'use client';

import React, { useState } from 'react';

export default function ManageProductPage() {
  const [title, setTitle] = useState('');
  return (
    <div>
      <div>관리자 상품 페이지</div>
      <input
        placeholder='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* <input placeholder='' />
      <input placeholder='title' />
      <input placeholder='title' />
      <input placeholder='title' />
      <input placeholder='title' />
      <input placeholder='title' />
      <input placeholder='title' /> */}

      <button
        onClick={() => {
          fetch('/api/postProduct', {
            method: 'POST',
            body: JSON.stringify({ data: { title } }),
          });
        }}
      >
        상품등록
      </button>
    </div>
  );
}
