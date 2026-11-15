import { NextResponse } from 'next/server';
import { productColl } from '@/shared/api/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  const product: unknown[] = [];

  for (let i = 0; i < data.length; i++) {
    const num = data[i];
    const result = await productColl
      .findOne({ num: num })
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
