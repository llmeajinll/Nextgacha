import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userColl, productColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('data : ', data);

  const product = await productColl.find({ num: { $in: data } }).toArray();
  const result = product.map((item) => {
    return {
      ...item,
      like: true,
    };
  });

  console.log('result : ', result);

  return NextResponse.json({ result, ok: true });
}
