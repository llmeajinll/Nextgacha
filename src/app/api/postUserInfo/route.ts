import { NextResponse } from 'next/server';
import { userColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const { email, nickname } = await req.json();
  console.log('email, nickname : ', email, nickname);

  const result = await userColl.insertOne({
    email,
    nickname,
    qna: [],
    review: [],
    like: [],
    point: 0,
    address: '',
  });

  console.log(result);
  return NextResponse.json({ ok: true }, { status: 200 });
}
