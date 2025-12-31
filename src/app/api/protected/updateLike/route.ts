import { NextResponse } from 'next/server';
import { userColl, productColl } from '@/lib/mongodb';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();

  let like = null;
  // console.log('server post like data:', data);
  // console.log('session : ', session?.user?.email);

  // if (!session?.user?.email) {
  //   return NextResponse.json(
  //     { error: 'User not login', ok: false },
  //     { status: 401 }
  //   );
  // }

  const result = await userColl
    .findOne({ email: session?.user?.email })
    .then((res) => {
      // console.log('mongodb getUser res:', res);
      return res;
    })
    .catch((err) => {
      console.log('mongodb getUser error:', err);
      return null;
    });

  // if (!result) {
  //   return NextResponse.json(
  //     { ok: false, error: 'User not found' },
  //     { status: 404 }
  //   );
  // }

  let updatedLike = result?.like || [];
  // console.log(updatedLike);
  const isIncludes = updatedLike.includes(data);
  // console.log(isIncludes);

  if (isIncludes === true) {
    updatedLike = updatedLike.filter((item: number) => item !== data);
    like = false;
  } else if (isIncludes === false) {
    updatedLike.push(data);
    like = true;
  }

  // console.log('Updated Like Array:', updatedLike);

  const updateResult = await userColl.updateOne(
    { email: session?.user?.email },
    { $set: { like: updatedLike } }
  );

  // console.log('Update Result:', updateResult);

  return NextResponse.json({ ok: true, like });
}
