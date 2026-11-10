import { NextResponse } from 'next/server';
import { findErrors } from '@/features/error-manage/lib/findErrors';
import { ERROR_STATUSES, ERROR_TYPES } from '@/features/error-manage/model/types';

// 관리자 전용: proxy ADMIN_API_PATHS가 막는다
// GET /api/getError?status=open|done|ignored&type=all|report|system&page=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = ERROR_STATUSES.find((s) => s.slug === (searchParams.get('status') ?? 'open'))?.status;
  const type = ERROR_TYPES.find((t) => t.type === (searchParams.get('type') ?? 'all'))?.type;
  const page = Number(searchParams.get('page') ?? 1);
  if (!status || !type || !Number.isInteger(page) || page < 1) {
    return NextResponse.json({ ok: false, message: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  try {
    return NextResponse.json({ ok: true, ...(await findErrors(status, type, page)) });
  } catch (err) {
    console.error('오류 목록 조회 실패:', err);
    return NextResponse.json({ ok: false, message: '일시적인 오류입니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
