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

import { kakaoSignIn, kakaoSignOut } from '@/shared/authActions';

export default function Header() {
  const [showCategory, setShowCategory] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { data: session } = useSession();

  return (
    <>
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
                <Link href='/search'>CATEGORY</Link>
              </span>

              <Link href='/notice'>
                <span className={menu}>NOTICE</span>
              </Link>
              <Link href='/resell'>
                <span className={menu}>RESELL</span>
              </Link>
            </div>
          </div>

          <div className={wrap}>
            <Search />
            {session ? (
              <form action={kakaoSignOut}>
                <button className={menu}>LOGOUT</button>
              </form>
            ) : (
              <form action={kakaoSignIn}>
                <button className={menu}>LOGIN</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
