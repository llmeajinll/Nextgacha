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
          // num: 1,
          // qna 배열을 정렬하여 새로운 필드로 덮어씌움
          qna: {
            $sortArray: {
              input: '$qna',
              sortBy: { created_at: -1 }, // 내림차순 정렬
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
