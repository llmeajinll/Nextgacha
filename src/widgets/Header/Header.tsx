'use server';

import { auth } from '@/auth';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await auth();

  // console.log('header session:', session?.user?.email);

  return <HeaderClient session={session} />;
}
