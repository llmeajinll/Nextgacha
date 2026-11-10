import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import { errorColl } from '@/shared/api/mongodb';
import { isAdminEmail } from '@/shared/lib/isAdmin';
import { isErrorStatus } from '@/features/error-manage/model/types';

// 관리자 전용: proxy ADMIN_API_PATHS + 라우트 안에서 한 번 더 확인 (docs/policies/api.md 관리자 권한 이중 확인)
export async function POST(req: Request) {
  const session = await auth();
  // proxy와 같이 로컬 dev에서만 건너뜀 (관리자 화면 작업 중). 운영·Preview는 막는다
  if (process.env.NODE_ENV !== 'development' && !isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ ok: false, message: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const status = body?.status;
  if (typeof id !== 'string' || !ObjectId.isValid(id) || id.length !== 24 || !isErrorStatus(status)) {
    return NextResponse.json({ ok: false, message: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  try {
    const { matchedCount } = await errorColl.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    if (!matchedCount) {
      return NextResponse.json({ ok: false, message: '오류 기록을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('오류 상태 변경 실패:', err);
    return NextResponse.json({ ok: false, message: '일시적인 오류입니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
