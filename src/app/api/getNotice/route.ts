import { NextResponse } from 'next/server';
import { findLiveNotice, findLiveNotices } from '@/entities/notice/lib/findNotices';

// 공개 조회: 게시 중인 공지만. ?num=N 이면 상세 + 이전·다음 공지, 없으면 목록
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get('num');
  if (raw === null) return NextResponse.json({ ok: true, notices: await findLiveNotices() });

  const num = Number(raw);
  if (!Number.isInteger(num) || num <= 0) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }
  const found = await findLiveNotice(num);
  if (!found) return NextResponse.json({ ok: false, message: '공지를 찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ ok: true, ...found });
}
