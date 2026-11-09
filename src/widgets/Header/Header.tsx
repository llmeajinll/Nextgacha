'use server';

import { auth } from '@/auth';
import { findCategoryMenu } from '@/entities/product/lib/findCategoryMenu';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const [session, categoryMenu] = await Promise.all([auth(), findCategoryMenu()]);

  // console.log('header session:', session?.user?.email);

  return <HeaderClient session={session} categoryMenu={categoryMenu} />;
}
