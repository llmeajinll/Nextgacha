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

  if (isLogin === true) {
    const user = await userColl.findOne(
      { email: session?.user?.email },
      { projection: { like: 1, _id: 0 } },
    );

    // console.log('========== like:', user?.like);

    const isLike = (user?.like || [])?.includes(num);
    result = {
      ...func,
      like: isLike,
    };

    // console.log('[server] if result : ', result);
  } else {
    result = {
      ...func,
      like: false,
    };

    // console.log('[server] else result : ', result);
  }
  // console.log('getOneProduct ; ', result);

  return NextResponse.json({ result, ok: true });
}
