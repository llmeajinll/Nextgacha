'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Grid3x3, Home, Search, User } from 'pixelarticons/react';
import { topBar, logo, bottomBar, tabLink } from './mobileNav.css';

const CATEGORY = '/search?type=main&tag=전체 상품&page=1';

// 모바일 전용: 위 로고 바 + 아래 탭 바 (웹에서는 css로 숨김)
const TABS = [
  { label: 'HOME', href: '/', Icon: Home, on: (p: string) => p === '/' },
  { label: 'CATEGORY', href: CATEGORY, Icon: Grid3x3, on: (p: string) => p.startsWith('/search') },
  // ponytail: 검색 전용 화면이 없어 CATEGORY와 같은 목록으로 보낸다. 검색 화면이 생기면 href만 바꾸기
  { label: 'SEARCH', href: CATEGORY, Icon: Search, on: () => false },
  { label: 'NOTICE', href: '/notice', Icon: Bell, on: (p: string) => p.startsWith('/notice') },
  { label: 'MYPAGE', href: '/mypage/cart', Icon: User, on: (p: string) => p.startsWith('/mypage') },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      <header className={topBar}>
        <Link href='/' className={logo} aria-label='NEXTGACHA 홈'>
          NEXTGACHA
        </Link>
      </header>
      <nav aria-label='쇼핑몰 메뉴' className={bottomBar}>
        {TABS.map(({ label, href, Icon, on }) => (
          <Link key={label} href={href} className={tabLink} aria-current={on(pathname) ? 'page' : undefined}>
            <Icon width={24} height={24} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
