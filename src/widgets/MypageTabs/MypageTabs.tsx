'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '@/features/cart/api/getCart';
import { tabs, tab, count } from './mypageTabs.css';

const TABS = [
  { label: 'CART', href: '/mypage/cart' },
  { label: 'LIKE', href: '/mypage/like' },
  { label: 'HISTORY', href: '/mypage/history?page=1' },
];

export default function MypageTabs() {
  const pathname = usePathname();
  // 장바구니 화면(useCart)과 같은 캐시라 CART 탭에서는 요청이 한 번만 나간다
  const { data } = useQuery({ queryKey: ['cartData'], queryFn: getCart });
  const cartCount = Array.isArray(data) ? data.reduce((a: number, it: any) => a + (it.cart?.list?.length ?? 0), 0) : 0;

  return (
    <nav aria-label='마이페이지 메뉴' className={tabs}>
      {TABS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          replace
          className={tab}
          aria-current={pathname === href.split('?')[0] ? 'page' : undefined}
        >
          {label}
          {label === 'CART' && cartCount > 0 && (
            <span className={count} aria-label={`${cartCount}개`}>
              {cartCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
