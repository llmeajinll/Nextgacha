'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const type = searchParams.get('type');
  const detail = searchParams.get('detail');
  const company = searchParams.get('company');
  return (
    <>
      <div>SearchPage</div>
      <div>{type}</div>
      <div>{detail}</div>
      <div>{company}</div>
    </>
  );
}
