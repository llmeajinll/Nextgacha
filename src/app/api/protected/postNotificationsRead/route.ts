import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { notificationColl } from '@/shared/api/mongodb';

// 내 알림을 모두 읽음으로
export async function POST() {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false }, { status: 401 });
  await notificationColl.updateMany({ email, read: false }, { $set: { read: true } });
  return NextResponse.json({ ok: true });
}
