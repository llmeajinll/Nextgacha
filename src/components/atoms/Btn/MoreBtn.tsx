'use client';

import React from 'react';
import { moreBtn } from './moreBtn.css';
import Link from 'next/link';

export default function MoreBtn() {
  return (
    <Link href='/main'>
      <div className={moreBtn}>더보기 {'⟩'}</div>
    </Link>
  );
}
