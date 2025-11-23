import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('client post like data:', data);

  const cookieStore = cookies();
  const cookie = (await cookieStore).get('userInfo');
  const userInfo = cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null;

  console.log(userInfo);

  const result = await userColl
    .findOne({ email: userInfo?.email })
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

  if (updatedLike.includes(data.num)) {
    // If already liked, remove the like
    updatedLike = updatedLike.filter((item: number) => item !== data.num);
  } else {
    // If not liked, add the like
    updatedLike.push(data.num);
  }

  console.log('Updated Like Array:', updatedLike);

  const updateResult = await userColl.updateOne(
    { email: userInfo.email },
    { $set: { like: updatedLike } }
  );

  console.log('Update Result:', updateResult);

  return NextResponse.json({ ok: true, like: updatedLike });
}
