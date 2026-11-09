import Link from 'next/link';
import { ChevronRight } from 'pixelarticons/react';
import * as s from './managerHeader.css';

export default function ManagerHeader() {
  return (
    <header className={s.header}>
      <Link href='/manager' className={s.logo}>
        NEXTGACHA
        <span className={s.badge}>ADMIN</span>
      </Link>
      <Link href='/' className={s.shop}>
        SHOP
<ChevronRight width={16} height={16} aria-hidden />
      </Link>
    </header>
  );
}
