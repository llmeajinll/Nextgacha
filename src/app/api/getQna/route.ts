import { NextResponse } from 'next/server';
import { qnaColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const num = Number(searchParams.get('num'));
  // console.log('num: ', num);

  if (num === null) {
    return NextResponse.json({ ok: false, error: 'num is required' });
  }

  const findResult = await qnaColl
    .aggregate([
      { $match: { num: Number(num) } },
      {
        $project: {
          qna: {
            $sortArray: {
              input: '$qna',
              sortBy: { created_at: -1 },
            },
          },
        },
      },
    ])
    .toArray();

  console.log('findResult:', findResult);
  const data = findResult[0];

  console.log('qna collection:', data);

  return NextResponse.json({ result: data, ok: true });
}
