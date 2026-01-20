import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userColl } from '@/lib/mongodb';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  const image = session?.user?.image;

  if (!email || email.trim() === '') {
    return NextResponse.json(
      {
        ok: false,
        error: 'Email parameter is required',
        result: {
          email: '',
          nickname: '',
          point: 0,
          address: '',
          image: '',
        },
      },
      { status: 400 }
    );
  }

  const user = await userColl
    .findOne(
      { email: email },
      {
        projection: {
          _id: 0,
          email: 1,
          nickname: 1,
          point: 1,
          address: 1,
        },
      }
    )
    .then((res) => {
      // console.log('mongodb getUser res:', res);
      revalidateTag('userInfo', 'default');
      return res;
    })
    .catch((err) => {
      console.log('mongodb getUser error:', err);
      return null;
    });

  const result = user ? { ...user, image: image } : null;

  return NextResponse.json({ ok: true, result });
}
