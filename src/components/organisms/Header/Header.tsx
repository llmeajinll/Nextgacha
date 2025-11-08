'use server';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { userColl } from '@/lib/mongodb';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await auth();

  console.log('header session:', session?.user?.email);

  return <HeaderClient session={session} />;
}
