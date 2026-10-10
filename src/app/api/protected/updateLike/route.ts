import { NextResponse } from 'next/server';
import { userColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, error: 'User not login' }, { status: 401 });
  }

  const num = await req.json();
  if (!Number.isInteger(num)) {
    return NextResponse.json({ ok: false, error: 'invalid num' }, { status: 400 });
  }

  // 원자적 토글: 이미 있으면 $pull, 없으면 $addToSet (읽고-쓰기 경쟁 조건 없음)
  const removed = await userColl.updateOne(
    { email, like: num },
    { $pull: { like: num } as any },
  );
  if (removed.modifiedCount === 1) {
    return NextResponse.json({ ok: true, like: false });
  }

  await userColl.updateOne({ email }, { $addToSet: { like: num } as any });
  return NextResponse.json({ ok: true, like: true });
}
