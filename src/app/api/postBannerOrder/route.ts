import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { bannerColl } from '@/shared/api/mongodb';

// 관리자 배너 노출 순서 (proxy의 ADMIN_API_PATHS). ids 순서대로 order를 1부터 다시 매긴다
export async function POST(req: Request) {
  const { ids } = await req.json().catch(() => ({}));
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 200 ||
    !ids.every((v) => typeof v === 'string' && ObjectId.isValid(v)) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ ok: false, message: 'invalid ids' }, { status: 400 });
  }
  try {
    await bannerColl.bulkWrite(
      ids.map((id: string, i: number) => ({ updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order: i + 1 } } } })),
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('postBannerOrder failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '순서를 바꾸지 못했어요.' }, { status: 500 });
  }
}
