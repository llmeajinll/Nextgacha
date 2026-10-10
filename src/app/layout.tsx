import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Header } from '@/widgets';
import { layoutContainer, relativeWrap } from './layout.css';
import { Analytics } from '@vercel/analytics/next';
import AlertModal from '@/shared/ui/AlertModal';
import QueryProvider from '@/shared/api/QueryProviders';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'NextGacha', template: '%s | NextGacha' },
  description: '가챠·캡슐토이 쇼핑몰 NextGacha — 1인당 같은 상품 최대 5개까지',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${notoSans.className}`}>
        <Analytics />

        <QueryProvider>
          <SessionProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <div className={relativeWrap}>
              <AlertModal />
              <div className={`${layoutContainer}`}>
                {/* useSearchParams를 쓰는 클라이언트 컴포넌트(Header의 검색, 결제/검색 페이지 등)는 Suspense 경계가 필요 */}
                <Suspense>
                  <Header />
                </Suspense>
                <main>
                  <Suspense>{children}</Suspense>
                </main>
              </div>
            </div>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
