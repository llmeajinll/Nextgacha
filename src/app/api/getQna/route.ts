import { NextResponse } from 'next/server';
import { qnaColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { data } = await req.json();
  console.log(data);

  const { searchParams } = new URL(req.url);

  const qna = await qnaColl.find(data).sort({ create: -1 }).toArray();

  return NextResponse.json(qna);
}
