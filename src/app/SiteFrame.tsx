'use client';

import { usePathname } from 'next/navigation';
import { FloatingActions, MobileNav } from '@/widgets';
import { fluidContainer, fluidMain, layoutContainer, webOnly } from './layout.css';

// 쇼핑몰은 1314px 컨테이너 + 사이트 Header, 메인·/notice·/mypage/cart는 모바일까지 유연한 폭, /manager/*는 자체 layout(관리자 헤더, 전체 폭)을 그대로 씀
export default function SiteFrame({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith('/manager')) return children;

  // 모바일 디자인이 있는 화면만 유연한 폭 (마이페이지는 장바구니만 있음, 좋아요·주문 내역은 아직 고정 폭)
  if (pathname === '/' || pathname === '/notice' || pathname.startsWith('/notice/') || pathname === '/mypage/cart') {
    return (
      <div className={fluidContainer}>
        <div className={webOnly}>{header}</div>
        <MobileNav />
        <main className={fluidMain}>{children}</main>
        <FloatingActions lift={pathname === '/mypage/cart' ? 'navPay' : 'nav'} />
      </div>
    );
  }

  return (
    <div className={layoutContainer}>
      {header}
      <main>{children}</main>
      <FloatingActions />
    </div>
  );
}
