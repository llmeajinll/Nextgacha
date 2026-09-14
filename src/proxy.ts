// export { auth as middleware } from '@/auth';
// import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { baseUrl } from './shared/api/baseUrl';
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
];

export default auth((req) => {
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
  if (pathname.startsWith('/manager') && !isPublicManagerPage) {
    if (!isAdminEmail(email)) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // 로그인한 사용자만 접근 가능한 페이지
  if (pathname.startsWith('/mypage')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl));
    }
  }

  // 디버깅 로그: 터미널에 이 로그가 찍히는지 확인하세요.
  // console.log('--- Middleware Path:', pathname, '| LoggedIn:', isLoggedIn);

  if (!isStaticFile && !isApiTrack && !pathname.startsWith('/api')) {
    // 비동기로 호출 (응답 속도 저하 방지)

    fetch(`${baseUrl}/api/track`, {
      method: 'POST',
      body: JSON.stringify({
        page: pathname,
        param: decodeURIComponent(`${req.nextUrl.search}`),
        referrer: req.headers.get('referer') || 'direct',
        userAgent: req.headers.get('user-agent'),
      }),
    }).catch((err) => console.error('Tracking Error:', err));
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
    '/mypage/:path*',
    '/manager/:path*',
    '/search',
    '/:code*',
  ],
};
