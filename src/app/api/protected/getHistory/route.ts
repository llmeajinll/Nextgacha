import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { orderColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  const { searchParams } = new URL(req.url);
  const pageStr = searchParams.get('page') || '';
  const page = Number(pageStr);

  const historyResult = await orderColl
    .find({ email })

    .sort({ _id: -1 })
    .skip((page - 1) * 8)
    .limit(8)
    .toArray();
  const total = await orderColl.countDocuments({ email });

  console.log('historyResult : ', historyResult, 'total', total);
  const result = { historyResult, total };

  revalidateTag('history', 'default');

  return NextResponse.json({ result, status: 200, ok: true });
}
