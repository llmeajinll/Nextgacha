import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { notificationColl } from '@/shared/api/mongodb';

// 내 사이트 알림 최근 20개 + 안 읽은 개수
export async function GET() {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false }, { status: 401 });

  const [list, unread] = await Promise.all([
    notificationColl
      .find({ email }, { projection: { _id: 0, email: 0 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray(),
    notificationColl.countDocuments({ email, read: false }),
  ]);
  return NextResponse.json({ ok: true, list, unread });
}
