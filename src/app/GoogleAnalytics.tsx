'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Google 태그 컨테이너(GTM-…). 운영 Vercel 환경에만 넣어서 로컬·Preview 방문은 안 쌓이게
const TAG_ID = process.env.NEXT_PUBLIC_GTM_ID;
// 컨테이너가 보내는 GA4 속성. 관리자 화면 opt-out 플래그에만 쓴다
const GA4_ID = 'G-5FR1N4DP8L';

// 페이지 조회(클라이언트 이동 포함)와 사이트 검색어(?search=)는 GA '향상된 측정'이 자동 수집한다.
// 카테고리·필터는 page_location의 쿼리, 상세 탭은 경로(/[code]/qna 등)로 남는다.
export default function GoogleAnalytics() {
  const isManager = usePathname().startsWith('/manager');
  if (!TAG_ID) return null;
  // 관리자 화면은 집계에서 뺀다: Google 태그가 hit마다 확인하는 공식 opt-out 플래그.
  // 이동(pushState → GA 자동 page_view)보다 먼저 바뀌어야 해서 effect가 아니라 렌더 중에 설정.
  // 같은 경로면 늘 같은 값을 쓰는 멱등 쓰기라 다시 렌더돼도 안전
  // eslint-disable-next-line react-hooks/immutability
  if (typeof window !== 'undefined') (window as unknown as Record<string, boolean>)[`ga-disable-${GA4_ID}`] = isManager;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtm.js?id=${TAG_ID}`} strategy='afterInteractive' />
      <Script id='google-tag' strategy='afterInteractive'>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`}
      </Script>
    </>
  );
}
