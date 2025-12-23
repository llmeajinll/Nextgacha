import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { userColl, cartColl } from '@/lib/mongodb';

export async function GET() {
  // const { searchParams } = new URL(req.url);
  // const email = searchParams.get('email') || '';

  const session = await auth();
  const email = session?.user?.email;

  console.log('auth email : ', email);

  const data = await cartColl.findOne(
    {
      user: email,
    },
    {
      projection: {
        _id: 0,
        cart: 1,
      },
    }
  );
  console.log('aggregated cart : ', data);

  return NextResponse.json({ ok: true, data }, { status: 200 });
}
