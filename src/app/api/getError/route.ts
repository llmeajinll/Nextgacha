import { NextResponse } from 'next/server';
import { orderColl, errorColl } from '@/lib/mongodb';
// import { auth } from '@/auth';

export async function GET(req: Request) {
  //   const session = await auth();
  //   const email = session?.user?.email;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId') || '';

  console.log('orderId : ', orderId);
  try {
    const result = await errorColl.find({}).toArray();
    console.log('getError : ', result);

    return NextResponse.json({ ok: true, result, status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, result: {}, status: 200 });
  }
}
