import { userColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  //   if (!session) return NextResponse.forbidden();

  const { address } = await req.json();

  try {
    await userColl.updateOne({ email: email }, { $set: { address } });
    // revalidateTag('userInfo', 'default');
    return NextResponse.json({ ok: true, address: address });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ ok: false });
  }
}
