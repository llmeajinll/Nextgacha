import { NextResponse } from 'next/server';
import { productColl } from '@/shared/api/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  const product: unknown[] = [];

  for (let i = 0; i < data.length; i++) {
    const num = data[i];
    const result = await productColl
      // 재입고 알림 신청자 이메일은 내보내지 않는다
      .findOne({ num: num }, { projection: { restockSubs: 0 } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error('mongodb getProduct error:', err instanceof Error ? err.message : err);
        return NextResponse.json({ status: 500, ok: false });
      });
    product.push(result);
  }


  return NextResponse.json({ data: product, ok: true });
}
