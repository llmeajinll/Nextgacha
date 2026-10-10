import { userColl } from '@/shared/api/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { address } = await req.json();
  if (typeof address !== 'string' || address.length > 200) {
    return NextResponse.json({ ok: false, message: 'invalid address' }, { status: 400 });
  }

  try {
    await userColl.updateOne({ email: email }, { $set: { address } });
    return NextResponse.json({ ok: true, address: address });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ ok: false });
  }
}
