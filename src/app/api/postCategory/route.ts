import { NextResponse } from 'next/server';
import { categoryColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { parseCategoryMenu } from '@/entities/product/lib/parseCategoryMenu';

// 관리자 전용 (proxy ADMIN_API_PATHS). 메뉴 전체를 받아 통째로 교체
// ponytail: 마지막 저장이 이김. 관리자 여럿이 동시에 고치면 updated_at 비교로 충돌 감지
export async function POST(req: Request) {
  const menu = parseCategoryMenu(await req.json().catch(() => null));
  if (!menu) {
    return NextResponse.json({ ok: false, message: 'invalid menu' }, { status: 400 });
  }

  await categoryColl.updateOne(
    { _id: 'menu' },
    { $set: { ...menu, updated_at: koreaTime() } },
    { upsert: true },
  );
  return NextResponse.json({ ok: true, menu });
}
