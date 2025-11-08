import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get('email') || '';
  console.log(`email: ${email}`);

  if (!email || email.trim() === '') {
    return NextResponse.json(
      { ok: false, error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  const result = await userColl
    .findOne({ email: email })
    .then((res) => {
      console.log('mongodb getUser res:', res);
      return res;
    })
    .catch((err) => {
      console.log('mongodb getUser error:', err);
      return null;
    });

  console.log('result:', result);

  const response = NextResponse.json({ ok: true, result });

  const data = {
    qna: result?.qna || [],
    review: result?.review || [],
    like: result?.like || [],
  };

  response.cookies.set({
    name: 'userInfo',
    value: JSON.stringify(data),
    httpOnly: false,
    path: '/',
  });

  return response;

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
