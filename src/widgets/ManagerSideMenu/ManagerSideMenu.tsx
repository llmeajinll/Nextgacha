'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout } from 'pixelarticons/react';
import { MANAGER_MENUS } from '@/shared/model/managerMenus';
import * as s from './managerSideMenu.css';

const ITEMS = [{ href: '/manager', base: '/manager', ko: '대시보드', icon: Layout }, ...MANAGER_MENUS];

export default function ManagerSideMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label='관리자 메뉴' className={s.nav}>
      {/* 배경 칸은 페이지 끝까지 늘어나고, 메뉴 목록만 스크롤을 따라옴 */}
      <div className={s.sticky}>
        <span className={s.label}>MENU</span>
        {ITEMS.map((m) => {
          // 대시보드는 정확히 /manager일 때만, 나머지는 하위 경로 포함
          const isActive = m.base === '/manager' ? pathname === m.base : pathname.startsWith(m.base);
          return (
            <Link
              key={m.href}
              href={m.href}
              aria-current={isActive ? 'page' : undefined}
              className={isActive ? `${s.item} ${s.active}` : s.item}
            >
              <m.icon aria-hidden />
              {m.ko}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
