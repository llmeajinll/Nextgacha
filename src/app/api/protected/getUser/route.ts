import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  const image = session?.user?.image;

  if (!email || email.trim() === '') {
    return NextResponse.json(
      { ok: false, error: 'Email parameter is required' },
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
      return res;
    })
    .catch((err) => {
      console.log('mongodb getUser error:', err);
      return null;
    });

  const result = user ? { ...user, image: image } : null;

  return NextResponse.json({ ok: true, result });

  // console.log('result:', result);

  // const response = NextResponse.json({ ok: true, result });

  //   const data = {
  //     qna: result?.qna || [],
  //     review: result?.review || [],
  //     like: result?.like || [],
  //   };

  // const { cart, ...rest } = result as any;

  // response.cookies.set({
  //   name: 'userInfo',
  //   value: JSON.stringify(result),
  //   httpOnly: false,
  //   path: '/',
  // });

  // response.cookies.set({
  //   name: 'userInfo',
  //   value: JSON.stringify(cart),
  //   httpOnly: false,
  //   path: '/',
  // });
  // return response;

  //   try {
  //     const data = {
  //       qna: result?.qna || [],
  //       review: result?.review || [],
  //       like: result?.like || [],
  //     };

  //     (await cookies()).set({
  //       name: 'userInfo',
  //       value: JSON.stringify(data),
  //       httpOnly: false,
  //       path: '/',
  //     });
  //     return NextResponse.json({ ok: true, result: result });
  //   } catch (err) {
  //     return NextResponse.json(
  //       { ok: false, error: (err as Error).message },
  //       { status: 500 }
  //     );
  //   }
}
