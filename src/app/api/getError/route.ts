import { NextResponse } from 'next/server';
import { orderColl, errorColl } from '@/shared/api/mongodb';

// 관리자 전용: proxy ADMIN_API_PATHS가 막는다 (로컬 dev에서는 가드 꺼짐)
export async function GET(req: Request) {
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
