import { NextResponse } from 'next/server';
import { pageViewsColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  try {
    if (type === 'search') {
      const searchResult = await pageViewsColl
        .find({
          page: { $type: 'string' },
        })
        .sort({ created_at: -1 })
        .toArray();
      return NextResponse.json({
        ok: true,
        result: searchResult,
      });
    } else if (type === 'num') {
      const productResult = await pageViewsColl
        .find({
          page: { $type: 'number' },
        })
        .sort({ page: 1 })
        .toArray();
      return NextResponse.json({
        ok: true,
        result: productResult,
      });
    } else {
      console.error('Invalid type parameter');
      return NextResponse.json({
        ok: false,
        result: {},
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        ok: false,
        error: '데이터 로딩 실패',
        result: {},
      },
      { status: 500 },
    );
  }
}
