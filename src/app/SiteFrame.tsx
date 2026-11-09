'use client';

import { usePathname } from 'next/navigation';
import { layoutContainer } from './layout.css';

// 쇼핑몰은 1314px 컨테이너 + 사이트 Header, /manager/*는 자체 layout(관리자 헤더, 전체 폭)을 그대로 씀
export default function SiteFrame({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  if (usePathname().startsWith('/manager')) return children;

  return (
    <div className={layoutContainer}>
      {header}
      <main>{children}</main>
    </div>
  );
}
