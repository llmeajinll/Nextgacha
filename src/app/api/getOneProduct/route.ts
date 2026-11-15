import { NextResponse } from 'next/server';
import { productColl, userColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const email = session?.user?.email;

  const num = Number(searchParams.get('num'));

  let func = await productColl.findOne({ num });
  if (!func) {
    return NextResponse.json({ ok: false, result: null }, { status: 404 });
  }

  const isLogin = email ? true : false;

  let result = null;

  if (email) {
    const user = await userColl.findOne(
      { email },
      { projection: { like: 1, _id: 0 } },
    );


    const isLike = (user?.like || [])?.includes(num);
    result = {
      ...func,
      like: isLike,
    };

  } else {
    result = {
      ...func,
      like: false,
    };

  }

  return NextResponse.json({ result, ok: true });
}
