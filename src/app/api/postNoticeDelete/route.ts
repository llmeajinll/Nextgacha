import { NextResponse } from 'next/server';
import { noticeColl } from '@/shared/api/mongodb';

// 관리자 공지 삭제 (proxy의 ADMIN_API_PATHS)
export async function POST(req: Request) {
  const { num } = await req.json().catch(() => ({}));
  if (!Number.isInteger(num)) return NextResponse.json({ ok: false, message: 'invalid num' }, { status: 400 });
  try {
    const res = await noticeColl.deleteOne({ num });
    if (res.deletedCount !== 1) return NextResponse.json({ ok: false, message: '공지를 찾을 수 없어요.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('postNoticeDelete failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '공지를 지우지 못했어요.' }, { status: 500 });
  }
}
