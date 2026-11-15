import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { reviewColl } from '@/shared/api/mongodb';

// 작성자 리뷰 삭제 (reviews.md "리뷰 수정·삭제와 숨김"): 언제든 지울 수 있고, order.review는 되돌리지 않아 다시 쓸 수 없다
export async function POST(req: Request) {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const { num, orderId } = await req.json().catch(() => ({}));
  if (!Number.isInteger(num) || num <= 0 || typeof orderId !== 'string' || orderId.length > 100) {
    return NextResponse.json({ ok: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }

  // 본인(user: email) 리뷰만 지운다
  const result = await reviewColl.updateOne({ num }, { $pull: { review: { orderId, user: email } } });
  if (result.modifiedCount === 0) {
    return NextResponse.json({ ok: false, message: '삭제할 리뷰가 없습니다.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
