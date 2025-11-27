import { NextResponse } from 'next/server';
import { userColl, productColl } from '@/lib/mongodb';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();
  const { num } = data;

  let like = null;
  console.log('server post like data:', data);
  console.log('session : ', session?.user?.email);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'User not login' }, { status: 401 });
  }

  const result = await userColl
    .findOne({ email: session?.user?.email })
    .then((res) => {
      console.log('mongodb getUser res:', res);
      return res;
    })
    .catch((err) => {
      console.log('mongodb getUser error:', err);
      return null;
    });

  if (!result) {
    return NextResponse.json(
      { ok: false, error: 'User not found' },
      { status: 404 }
    );
  }

  let updatedLike = result.like || [];
  const isIncludes = updatedLike.includes(num);

  if (isIncludes) {
    updatedLike = updatedLike.filter((item: number) => item !== num);
    like = false;
  } else {
    updatedLike.push(num);
    like = true;
  }

  console.log('Updated Like Array:', updatedLike);

  const updateResult = await userColl.updateOne(
    { email: session?.user?.email },
    { $set: { like: updatedLike } }
  );

  console.log('Update Result:', updateResult);

  return NextResponse.json({ ok: true, like });
}

