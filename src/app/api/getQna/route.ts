import { NextResponse } from 'next/server';
import { qnaColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const num = Number(searchParams.get('num'));
  console.log('num: ', num);

  if (num === null) {
    return NextResponse.json({ ok: false, error: 'num is required' });
  }

  const result = await qnaColl.find({ num }).sort({ create: -1 }).toArray();
  console.log('qna collection:', result);

  return NextResponse.json({ result, ok: true });
}
