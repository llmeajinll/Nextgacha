import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { bannerColl } from '@/shared/api/mongodb';

// 관리자 배너 삭제 (proxy의 ADMIN_API_PATHS)
export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, message: 'invalid id' }, { status: 400 });
  }
  try {
    const res = await bannerColl.deleteOne({ _id: new ObjectId(id) });
    if (res.deletedCount !== 1) return NextResponse.json({ ok: false, message: '배너를 찾을 수 없어요.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('postBannerDelete failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '배너를 지우지 못했어요.' }, { status: 500 });
  }
}
