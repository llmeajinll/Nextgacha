import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { isAdminEmail } from './shared/lib/isAdmin';

const { auth } = NextAuth(authConfig);

const DEVICE_COOKIE = 'did';

const ADMIN_API_PATHS = [
  '/api/postEditProduct',
  '/api/postEvent',
  '/api/postProduct',
  '/api/postCheckToSending',
  '/api/postSendingToFinish',
  '/api/getOrderSort',
  '/api/getError',
  '/api/postErrorStatus',
  '/api/postCategory',
  '/api/postQnaAnswer',
  '/api/getUserDetail',
  '/api/postBanner',
  '/api/postBannerDelete',
  '/api/postBannerOrder',
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const email = req.auth?.user?.email;

  const { pathname } = req.nextUrl;

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

  // ponytail: 관리자 화면 작업 중이라 로컬 dev(next dev)에서만 관리자 가드(페이지·API)를 끔. 작업 끝나면 이 줄 제거.
  // 운영·Preview(NODE_ENV=production)에서는 그대로 막는다 — 주문 페이지가 DB를 직접 읽어 개인정보가 보이기 때문.
  const skipAdminGuard = process.env.NODE_ENV === 'development';

  // 관리자 전용 API: 로그인 + ADMIN_EMAILS 등록된 이메일만 통과
  if (ADMIN_API_PATHS.includes(pathname)) {
    if (!skipAdminGuard && !isAdminEmail(email)) {
      return NextResponse.json(
        { ok: false, message: 'forbidden' },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  // 정적 파일·API는 아래 페이지 처리(가드, 기기 ID 쿠키) 대상이 아님
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 이미지, 파비콘 등 제외
  ) {
    return NextResponse.next();
  }

  // 관리자 전용 페이지: /manager 메인 메뉴는 공개, 나머지는 ADMIN_EMAILS만
  const isPublicManagerPage = pathname === '/manager';
  if (pathname.startsWith('/manager') && !isPublicManagerPage && !skipAdminGuard) {
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

  // 로그인이 되었거나 보호된 경로가 아니면 다음 단계로 통과
  const res = NextResponse.next();
  // 기기 ID: 결제 때 주문에 저장해서 다른 계정 중복 구매를 관리자 화면에 표시 (findSuspects)
  if (!req.cookies.has(DEVICE_COOKIE)) {
    res.cookies.set(DEVICE_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return res;
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
    '/api/postErrorStatus',
    '/api/postCategory',
    '/api/postQnaAnswer',
    '/api/getUserDetail',
    '/api/postBanner',
    '/api/postBannerDelete',
    '/api/postBannerOrder',
    '/mypage/:path*',
    '/manager/:path*',
    '/search',
    '/:code*',
  ],
};
