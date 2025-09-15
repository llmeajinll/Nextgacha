import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
// import Kakao from 'next-auth/providers/kakao';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    // Kakao,
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return '/main';
      // return baseUrl;
    },
  },
});
