import { NextFetchEvent, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { isAdminEmail } from './shared/lib/isAdmin';

const { auth } = NextAuth(authConfig);

const ADMIN_API_PATHS = [
  '/api/postEditProduct',
  '/api/postEvent',
  '/api/postProduct',
  '/api/postCheckToSending',
  '/api/postSendingToFinish',
  '/api/getOrderSort',
  '/api/getError',
  '/api/postCategory',
];

export default auth((req, event) => {
  const isLoggedIn = !!req.auth;
  const email = req.auth?.user?.email;

  const { pathname } = req.nextUrl;

  const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');
  const isApiTrack = pathname.startsWith('/api/track');

  // /api/protected로 시작하는 모든 경로에 대해 비로그인 시 차단
  if (pathname.startsWith('/api/protected')) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { ok: false, message: 'authentication failed' },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  // 관리자 전용 API: 로그인 + ADMIN_EMAILS 등록된 이메일만 통과
  if (ADMIN_API_PATHS.includes(pathname)) {
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { ok: false, message: 'forbidden' },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  // 1. 기록하고 싶지 않은 경로(정적 파일, API 등) 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 이미지, 파비콘 등 제외
  ) {
    return NextResponse.next();
  }

  // 관리자 전용 페이지: /manager 메인 메뉴와 /manager/statistics는 공개, 나머지는 ADMIN_EMAILS만
  const isPublicManagerPage =
    pathname === '/manager' || pathname.startsWith('/manager/statistics');
  // ponytail: 관리자 화면 작업 중이라 로컬 dev(next dev)에서만 페이지 가드를 끔. 작업 끝나면 이 줄 제거.
  // 운영·Preview(NODE_ENV=production)에서는 그대로 막는다 — 주문 페이지가 DB를 직접 읽어 개인정보가 보이기 때문.
  const skipManagerGuard = process.env.NODE_ENV === 'development';
  if (pathname.startsWith('/manager') && !isPublicManagerPage && !skipManagerGuard) {
    if (!isAdminEmail(email)) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // 로그인한 사용자만 접근 가능한 페이지
  if (pathname.startsWith('/mypage')) {
    if (!isLoggedIn) {
      // 로그인 후 원래 페이지로 돌아오도록 callbackUrl 전달
      const signinUrl = new URL('/signin', req.nextUrl);
      signinUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
      return NextResponse.redirect(signinUrl);
    }
  }

  // 페이지뷰 기록. <Link> 프리페치는 실제 방문이 아니므로 제외
  const isPrefetch =
    req.headers.has('next-router-prefetch') ||
    req.headers.get('sec-purpose')?.includes('prefetch') ||
    req.headers.get('purpose') === 'prefetch';

  if (!isStaticFile && !isApiTrack && !isPrefetch) {
    const search = new URLSearchParams(req.nextUrl.search);
    search.delete('_rsc'); // 클라이언트 내비게이션용 내부 파라미터
    const query = search.toString();

    // 같은 배포(프리뷰/프로덕션)로 보내고, 응답 후에도 요청이 끝까지 가도록 waitUntil
    // next-auth가 미들웨어 2번째 인자(NextFetchEvent)를 그대로 넘기지만 타입은 route용으로 잡혀 있음
    (event as unknown as NextFetchEvent).waitUntil(
      fetch(`${req.nextUrl.origin}/api/track`, {
        method: 'POST',
        body: JSON.stringify({
          page: pathname,
          param: query ? decodeURIComponent(`?${query}`) : '',
          referrer: req.headers.get('referer') || 'direct',
          userAgent: req.headers.get('user-agent'),
        }),
      }).catch((err) => console.error('Tracking Error:', err)),
    );
  }

  // 로그인이 되었거나 보호된 경로가 아니면 다음 단계로 통과
  return NextResponse.next();
});

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/api/protected/:path*',
    '/api/postEditProduct',
    '/api/postEvent',
    '/api/postProduct',
    '/api/postCheckToSending',
    '/api/postSendingToFinish',
    '/api/getOrderSort',
    '/api/getError',
    '/api/postCategory',
    '/mypage/:path*',
    '/manager/:path*',
    '/search',
    '/:code*',
  ],
};
