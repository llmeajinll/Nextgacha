import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { findUserDetail } from '@/features/user-manage/lib/findUserDetail';

// 관리자 회원 상세 (proxy의 ADMIN_API_PATHS). 이메일 대신 회원 문서 id로 찾는다
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, message: 'invalid id' }, { status: 400 });
  }
  try {
    const result = await findUserDetail(id);
    if (!result) return NextResponse.json({ ok: false, message: '회원을 찾을 수 없어요.' }, { status: 404 });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    console.error('getUserDetail failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '회원 정보를 불러오지 못했어요.' }, { status: 500 });
  }
}
