import { NextResponse } from 'next/server';
import { reviewColl } from '@/shared/api/mongodb';
import { HIDE_REASONS } from '@/shared/model/reviewHideReasons';

// 관리자 리뷰 숨김/해제 (proxy ADMIN_API_PATHS). 삭제가 아니라 표시만 막는다
export async function POST(req: Request) {
  const { num, orderId, hidden, reason } = await req.json().catch(() => ({}));
  if (
    !Number.isInteger(num) || num <= 0 ||
    typeof orderId !== 'string' || orderId.length > 100 ||
    typeof hidden !== 'boolean' ||
    (hidden && !HIDE_REASONS.includes(reason))
  ) {
    return NextResponse.json({ ok: false, message: '잘못된 요청이에요.' }, { status: 400 });
  }

  const result = await reviewColl.updateOne(
    { num },
    hidden
      ? { $set: { 'review.$[r].hidden': true, 'review.$[r].hiddenReason': reason } }
      : { $unset: { 'review.$[r].hidden': '', 'review.$[r].hiddenReason': '' } },
    { arrayFilters: [{ 'r.orderId': orderId }] },
  );
  if (result.matchedCount === 0) return NextResponse.json({ ok: false, message: '리뷰를 찾지 못했어요.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
