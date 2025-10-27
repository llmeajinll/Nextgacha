import { signIn, signOut } from '@/auth';

export default function SignIn() {
  return (
    <div>
      <form
        action={async () => {
          'use server';
          await signIn('kakao');
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
