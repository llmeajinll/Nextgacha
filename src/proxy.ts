// export { auth as middleware } from '@/auth';
// import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { baseUrl } from './shared/baseUrl';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const { pathname } = req.nextUrl;

  const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');
  const isApiTrack = pathname.startsWith('/api/track');

  // 1. 기록하고 싶지 않은 경로(정적 파일, API 등) 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 이미지, 파비콘 등 제외
  ) {
    return NextResponse.next();
  }

  // 디버깅 로그: 터미널에 이 로그가 찍히는지 확인하세요.
  // console.log('--- Middleware Path:', pathname, '| LoggedIn:', isLoggedIn);
  // /api/protected로 시작하는 모든 경로에 대해 비로그인 시 차단
  if (pathname.startsWith('/api/protected')) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { ok: false, message: 'authentication failed' },
        { status: 401 },
      );
    }
  }

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
  matcher: ['/api/protected/:path*', '/mypage/:path*', '/search', '/:code*'],
};
