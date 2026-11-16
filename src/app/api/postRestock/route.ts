import { NextResponse } from 'next/server';
import { productColl } from '@/shared/api/mongodb';
import { notifyUser } from '@/shared/api/notifyUser';
import { toKoreaTime } from '@/shared/lib/koreaTime';

// 관리자: 재입고 예정 시각을 정하고 신청자에게 사이트 알림을 보낸다 (proxy ADMIN_API_PATHS)
// "[상품]가 YYYY.MM.DD HH:00에 재입고 예정입니다." — 시각은 정시 단위
export async function POST(req: Request) {
  const { num, at } = await req.json().catch(() => ({}));
  const date = typeof at === 'string' ? new Date(at) : null;
  if (!Number.isInteger(num) || num <= 0 || !date || Number.isNaN(date.getTime()) || date.getTime() < Date.now()) {
    return NextResponse.json({ ok: false, message: '재입고 예정 시각을 지금 이후로 정해 주세요.' }, { status: 400 });
  }
  date.setMinutes(0, 0, 0);

  const product = await productColl.findOneAndUpdate(
    { num },
    { $set: { restockAt: date } },
    { projection: { _id: 0, title: 1, restockSubs: 1 } },
  );
  if (!product) return NextResponse.json({ ok: false, message: '상품을 찾지 못했어요.' }, { status: 404 });

  const subs: string[] = product.restockSubs ?? [];
  await notifyUser(subs, `${product.title}가 ${toKoreaTime(date).format('YYYY.MM.DD HH:00')}에 재입고 예정입니다.`, `/${num}`);
  return NextResponse.json({ ok: true, notified: subs.length, restockAt: date });
}
