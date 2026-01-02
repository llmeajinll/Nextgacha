import type { NextAuthConfig } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

export const authConfig = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  // 여기에 middleware에서 검사할 페이지 접근 제어 로직 등을 넣습니다.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith('/api/protected') ||
        nextUrl.pathname.startsWith('/mypage');

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // 로그인 안 됐으면 거부
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
