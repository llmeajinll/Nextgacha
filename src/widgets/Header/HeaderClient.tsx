'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Search from '@/features/search/ui/Search';
import MegaMenu from './MegaMenu';
import {
  headerContainer,
  bar,
  logo,
  menuContainer,
  nav,
  tools,
  menu,
  activeMenu,
  openMenu,
  backdrop,
} from './header.css';

import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

import { Session } from 'next-auth';
import type { CategoryMenu } from '@/entities/product/model/types';
import { useSearchParams, usePathname } from 'next/navigation';
import { useSplitRoute as useSpliteRoute } from '@/shared/hooks';
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/entities/user/model/store';

export default function Header({
  session,
  categoryMenu,
}: {
  session: Session | null;
  categoryMenu: CategoryMenu;
}) {
  const [showCategory, setShowCategory] = useState(false);
  const { firstRoute } = useSpliteRoute();
  const [{ data, isPending, error }] = useAtom(userInfoAtom);
  const pathname = usePathname();
  console.log(firstRoute);
  console.log('JOTAI userInfoAtom : ', data);

  return (
    <>
      {firstRoute !== 'manager' && (
        <div
          className={headerContainer}
          onMouseLeave={() => setShowCategory(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowCategory(false)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget))
              setShowCategory(false);
          }}
        >
          <header className={bar}>
            <div className={menuContainer}>
              <Link href='/' className={logo} aria-label='NEXTGACHA 홈'>
                {[...'NEXTGACHA'].map((c, i) => (
                  <span key={i} aria-hidden>
                    {c}
                  </span>
                ))}
              </Link>
              <nav aria-label='쇼핑몰 메뉴' className={nav}>
                <Link
                  href='/search?type=main&tag=전체 상품&page=1'
                  className={`${menu} ${firstRoute === 'search' ? activeMenu : showCategory ? openMenu : ''}`}
                  aria-haspopup='true'
                  aria-expanded={showCategory}
                  onMouseEnter={() => setShowCategory(true)}
                  onFocus={() => setShowCategory(true)}
                >
                  CATEGORY
                </Link>
                <Link
                  href='/notice'
                  className={`${menu} ${firstRoute === 'notice' ? activeMenu : ''}`}
                  aria-current={firstRoute === 'notice' ? 'page' : undefined}
                >
                  NOTICE
                </Link>
                {session?.user && (
                  <Link
                    href='/mypage/cart'
                    className={`${menu} ${firstRoute === 'mypage' ? activeMenu : ''}`}
                    aria-current={firstRoute === 'mypage' ? 'page' : undefined}
                  >
                    MYPAGE
                  </Link>
                )}
              </nav>

              <div className={tools}>
                <Search />
                {session?.user ? (
                  <button className={menu} onClick={() => signOut()}>
                    LOGOUT
                  </button>
                ) : (
                  <button className={menu} onClick={() => signIn('kakao')}>
                    LOGIN
                  </button>
                )}
              </div>
            </div>
          </header>
          {showCategory && (
            <>
              <MegaMenu
                menu={categoryMenu}
                onClose={() => setShowCategory(false)}
              />
              <div className={backdrop} />
            </>
          )}
        </div>
      )}
    </>
  );
}
