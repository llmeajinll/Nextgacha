import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
// import Kakao from 'next-auth/providers/kakao';
import { authConfig } from './auth.config';
import { userColl } from './lib/mongodb';
import { koreaTime } from './shared/koreaTime';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // providers: [
  //   KakaoProvider({
  //     clientId: process.env.KAKAO_CLIENT_ID!,
  //     clientSecret: process.env.KAKAO_CLIENT_SECRET!,
  //   }),
  //   // Kakao,
  // ],
  // trustHost: true,
  // secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,

  callbacks: {
    ...authConfig.callbacks,
    async redirect({ url, baseUrl }) {
      return '/';
      // return baseUrl;
    },
    async signIn({ user, account, profile }) {
      console.log('signIn callback called', user, account, profile);
      if (account?.provider === 'kakao') {
        try {
          // DB 연결 및 유저 확인 로직
          const existingUser = await userColl.findOne({ email: user.email });

          if (!existingUser) {
            // 첫 로그인 시 DB 생성
            await userColl.insertOne({
              email: user.email,
              nickname: user.name,
              address: '',
              qna: [],
              review: [],
              like: [],
              point: 0,
              created_at: koreaTime,
            });
          }
          return true; // 로그인 승인
        } catch (error) {
          console.error('로그인 DB 작업 중 에러:', error);
          return false; // 로그인 거부 (에러 발생 시)
        }
      }
      return true;
    },
  },
});
