import { NextResponse } from 'next/server';
import { productColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('data : ', data);
  let product: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const num = data[i];
    const result = await productColl
      .findOne({ num: num })
      .then((res) => {
        // console.log('mongodb getProduct res:', res);
        return res;
      })
      .catch((err) => {
        console.log('mongodb getProduct error:', err);
        return NextResponse.json({ status: 500, ok: false });
      });
    product.push(result);
  }

  // console.log('product : ', product);

  return NextResponse.json({ data: product, ok: true });
}
