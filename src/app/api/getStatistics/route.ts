import { NextResponse } from 'next/server';
import { pageViewsColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  console.log('dho dkseho');

  try {
    const searchResult = await pageViewsColl
      .find({
        page: { $type: 'string' },
      })
      .sort({ count: -1 })
      .toArray();

    const productResult = await pageViewsColl
      .find({
        page: { $type: 'number' },
      })
      .sort({ count: -1 })
      .toArray();

    console.log(searchResult, productResult);
    const result = { searchResult, productResult };

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        ok: false,
        error: '데이터 로딩 실패',
        result: { searchResult: [], productResult: [] },
      },
      { status: 500 },
    );
  }
}
