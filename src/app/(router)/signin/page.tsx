import { signIn, signOut } from '@/auth';

const ERROR_MESSAGE: Record<string, string> = {
  email_required:
    '카카오 로그인 시 이메일 제공에 동의해야 이용할 수 있습니다. 다시 로그인하며 이메일 제공에 동의해주세요.',
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  // 같은 사이트 내부 경로만 허용 (open redirect 방지)
  const redirectTo =
    callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
      ? callbackUrl
      : '/';

  return (
    <div>
      {error && <p>{ERROR_MESSAGE[error] ?? '로그인에 실패했습니다.'}</p>}
      <form
        action={async () => {
          'use server';
          await signIn('kakao', { redirectTo });
        }}
      >
        <button type='submit'>Signin with Kakao</button>
      </form>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button type='submit'>Signout with Kakao</button>
      </form>
    </div>
  );
}
