import { NextResponse } from 'next/server';
import { reviewColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const num = Number(searchParams.get('num'));
  // console.log('num: ', num);

  if (num === null) {
    return NextResponse.json({ ok: false, error: 'num is required' });
  }

  const result = await reviewColl.find({ num }).sort({ create: -1 }).toArray();
  // console.log('review collection:', result);

  return NextResponse.json({ result, ok: true });
}
