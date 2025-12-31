import { NextResponse } from 'next/server';
import { productColl } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';

export async function POST(req: Request) {
  const { list } = await req.json();
  const result = await validateStock(list);
  //   console.log(result);
  if (result.isAvailable === false) {
    return Response.json(result, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
