import { NextResponse } from 'next/server';
import { reviewColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const num = Number(searchParams.get('num'));
  const page = Number(searchParams.get('page')) || 0;
  const limit = 8;
  // console.log('num: ', num);

  if (num === null) {
    return NextResponse.json({ ok: false, error: 'num is required' });
  }

  try {
    const result = await reviewColl
      .aggregate([
        // 1. 해당 num을 가진 문서 찾기
        { $match: { num: num } },

        // 2. review 배열을 개별 문서로 풀기
        { $unwind: '$review' },

        // 3. 리뷰 생성일 기준 최신순 정렬 (review 내부의 created_at 기준)
        { $sort: { 'review.created_at': -1 } },

        // 4. 페이지네이션 적용
        { $skip: page * limit },
        { $limit: limit },

        // 5. 불필요한 num, _id 등은 버리고 review 내용만 최상위로 올리기
        { $replaceRoot: { newRoot: '$review' } },
      ])
      .toArray();

    const totalCount = await reviewColl.countDocuments({ num });
    const hasMore = (page + 1) * limit < totalCount;

    return NextResponse.json({
      ok: true,
      result,
      hasMore,
    });
  } catch (error) {
    return NextResponse.json({ error: '데이터 로딩 실패' }, { status: 500 });
  }
}
