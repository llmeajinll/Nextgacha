import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { reviewColl } from '@/shared/api/mongodb';
import { daysBefore, REVIEW_EDIT_DAYS } from '@/shared/lib/businessDays';
import { koreaTime } from '@/shared/lib/koreaTime';

// 리뷰 수정 (docs/policies/reviews.md): 작성자 본인, 작성 후 5일 안에만. 별점과 내용만 바꾼다
export async function POST(req: Request) {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const { num, orderId, rate, text } = await req.json().catch(() => ({}));
  if (
    !Number.isInteger(num) || num <= 0 ||
    typeof orderId !== 'string' || orderId.length > 100 ||
    !Number.isInteger(rate) || rate < 1 || rate > 5 ||
    typeof text !== 'string' || text.trim().length === 0 || text.length > 1000
  ) {
    return NextResponse.json({ ok: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }

  // created_at은 koreaTime() 문자열이라 사전순 비교. 기한이 지났거나 남의 리뷰면 바뀌는 게 없다
  const result = await reviewColl.updateOne(
    { num },
    { $set: { 'review.$[r].rate': rate, 'review.$[r].content': text, 'review.$[r].updated_at': koreaTime() } },
    { arrayFilters: [{ 'r.orderId': orderId, 'r.user': email, 'r.created_at': { $gte: daysBefore(REVIEW_EDIT_DAYS) } }] },
  );
  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { ok: false, message: `리뷰는 작성 후 ${REVIEW_EDIT_DAYS}일 안에만 수정할 수 있습니다.` },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true });
}
