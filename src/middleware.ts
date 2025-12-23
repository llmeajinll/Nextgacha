// export { auth as middleware } from '@/auth';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 디버깅 로그: 터미널에 이 로그가 찍히는지 확인하세요.
  console.log('--- Middleware Path:', pathname, '| LoggedIn:', isLoggedIn);
  // /api/protected로 시작하는 모든 경로에 대해 비로그인 시 차단
  if (pathname.startsWith('/api/protected')) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { ok: false, message: 'authentication failed' },
        { status: 401 }
      );
    }
  }

  // 로그인이 되었거나 보호된 경로가 아니면 다음 단계로 통과
  return NextResponse.next();
});

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ['/api/protected/:path*'],
};
