import { NextResponse } from 'next/server';
import { orderColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId') || '';

  console.log('orderId : ', orderId);
  try {
    const result = await orderColl.findOne({ orderId, email });
    console.log('getOneHistory : ', result);

    return NextResponse.json({ ok: true, result, status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, result: {}, status: 200 });
  }
}
