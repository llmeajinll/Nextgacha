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
  const pageStr = searchParams.get('page') || '';
  const page = Number(pageStr);

  const historyResult = await orderColl
    // 결제 식별자·기기 정보는 화면에 필요 없다
    .find({ email }, { projection: { paymentKey: 0, deviceId: 0, ip: 0 } })

    .sort({ _id: -1 })
    .skip((page - 1) * 8)
    .limit(8)
    .toArray();
  const total = await orderColl.countDocuments({ email });

  const result = { historyResult, total };

  return NextResponse.json({ result, status: 200, ok: true });
}
