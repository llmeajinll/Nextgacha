'use client';
import { signIn, signOut } from '@/auth';
import { useSession } from 'next-auth/react';

export default function Main() {
  const { data: session, status } = useSession();
  console.log('session', session);
  console.log('status', status);

  // if (status === 'loading') {
  //     return <div>Loading...</div>;
  // }

  // if (status === 'unauthenticated') {}
  return (
    <div>
      {session && <div>로그인 성공하면 보임</div>}

      <div>항상 보임</div>
    </div>
  );
}
