'use client';

import React, { useState } from 'react';
import { Category } from '@/components/atoms';
import { Search } from '@/components/molecules';
import {
  headerContainer,
  logo,
  menuContainer,
  wrap,
  menu,
  search,
} from './header.css';
import Link from 'next/link';

export default function Header() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className={headerContainer}>
        {show && <Category setShow={setShow} />}
        <div className={menuContainer}>
          <div className={wrap}>
            <Link href='/'>
              <div className={logo}>NEXTGACHA</div>
            </Link>
            <div className={wrap}>
              <span
                className={menu}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
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
            <span className={menu}>LOGIN</span>
          </div>
        </div>
      </div>
    </>
  );
}
