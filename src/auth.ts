import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { userColl } from './shared/api/mongodb';
import { koreaTime } from './shared/lib/koreaTime';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  // redirect 콜백은 두지 않는다: NextAuth 기본값이 같은 출처의 callbackUrl로 돌려보낸다
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'kakao') {
        // 모든 유저 데이터가 email을 키로 쓰므로, 카카오 이메일 동의를 거부하면
        // email: null 유저 하나로 합쳐진다 → 로그인 거부
        if (!user.email) return '/signin?error=email_required';

        try {
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
              keep: [],
              point: 0,
              created_at: koreaTime(),
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
