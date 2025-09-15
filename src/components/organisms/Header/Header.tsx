import React from 'react';
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
  return (
    <div className={headerContainer}>
      <div className={menuContainer}>
        <div className={wrap}>
          <Link href='/'>
            <div className={logo}>NEXTGACHA</div>
          </Link>
          <div className={wrap}>
            <span className={menu}>CATEGORY</span>
            <span className={menu}>NOTICE</span>
            <span className={menu}>RESELL</span>
          </div>
        </div>

        <div className={wrap}>
          <Search />
          <span className={menu}>LOGIN</span>
        </div>
      </div>
    </div>
  );
}
