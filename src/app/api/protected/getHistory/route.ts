import { NextResponse } from 'next/server';
import { orderColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  console.log(session?.user, email);
  const order = orderColl
    .aggregate([
      {
        $match: {
          customer: email,
        },
      },
    ])
    .sort({ created_at: -1 });
  const result = await order.toArray();

  return NextResponse.json({ result: result, status: 200 });
}
