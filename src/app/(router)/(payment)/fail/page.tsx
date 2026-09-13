'use client';

import React from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { Range } from '@/shared/ui';
import {
  pageContainer,
  heading,
  messageText,
  footerRow,
  footerLinkHome,
  footerLinkMypage,
} from '../checkout/[orderId]/page.css';

export default function page() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className={pageContainer}>
      <h1 className={heading}>결제 과정에서 오류가 발생하였습니다 :{'('}</h1>
      <div className={messageText}>{message}</div>
      <Range gap='50' className={footerRow}>
        <Link href='/' className={footerLinkHome}>
          HOME
        </Link>
        <Link href='/mypage/cart' className={footerLinkMypage}>
          CART
        </Link>
      </Range>
    </div>
  );
}
