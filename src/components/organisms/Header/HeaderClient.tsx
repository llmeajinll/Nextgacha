'use client';

import React, { useEffect, useState } from 'react';

// import { signIn, signOut } from '@/auth';
import { Search, Category } from '@/components/molecules';
import {
  headerContainer,
  logo,
  menuContainer,
  wrap,
  menu,
  search,
} from './header.css';

import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

// import { kakaoSignIn, kakaoSignOut } from '@/shared/authActions';
import { Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';
import { useSpliteRoute } from '@/app/hooks';
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/jotai/store';

export default function Header({ session }: { session: Session | null }) {
  const [showCategory, setShowCategory] = useState(false);
  const { firstRoute } = useSpliteRoute();
  const [{ data, isPending, error }] = useAtom(userInfoAtom);
  console.log(firstRoute);
  console.log('JOTAI userInfoAtom : ', data);

  return (
    <>
      {firstRoute !== 'manager' && (
        <div className={headerContainer}>
          {showCategory && <Category setShow={setShowCategory} />}
          <div className={menuContainer}>
            <div className={wrap}>
              <Link href='/'>
                <div className={logo}>NEXTGACHA</div>
              </Link>
              <div className={wrap}>
                <span
                  className={menu}
                  onMouseEnter={() => setShowCategory(true)}
                  onMouseLeave={() => setShowCategory(false)}
                >
                  <Link
                    href='/search?type=main&detail=전체 상품'
                    style={{
                      color: `${firstRoute === 'search' ? '#75C3FE' : ''}`,
                    }}
                  >
                    CATEGORY
                  </Link>
                </span>

                <Link href='/notice'>
                  <span
                    className={menu}
                    style={{
                      color: `${firstRoute === 'notice' ? '#75C3FE' : ''}`,
                    }}
                  >
                    NOTICE
                  </span>
                </Link>
                {session?.user && (
                  <Link href={`/mypage/cart`}>
                    <span
                      className={menu}
                      style={{
                        color: `${firstRoute === 'mypage' ? '#75C3FE' : ''}`,
                      }}
                    >
                      MYPAGE
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className={wrap}>
              <Search />
              {session?.user ? (
                // <form action={kakaoSignOut}>
                //   <button className={menu}>LOGOUT</button>
                // </form>

                <button className={menu} onClick={() => signOut()}>
                  LOGOUT
                </button>
              ) : (
                // <form action={kakaoSignIn}>
                //   <button className={menu}>LOGIN</button>
                // </form>
                <button className={menu} onClick={() => signIn('kakao')}>
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
