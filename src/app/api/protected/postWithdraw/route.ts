import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cartColl, mongodbClient, orderColl, qnaColl, reviewColl, userColl } from '@/shared/api/mongodb';

// 회원 탈퇴 (docs/policies/members.md "회원 탈퇴")
// - 진행 중인 주문(상품 확인중·배송중)이 있으면 막는다
// - 리뷰·QnA는 작성자를 익명으로 바꿔 남기고, 장바구니·회원 문서(포인트 포함)는 지운다
// - 주문은 법정 보관 기간 동안 남긴다 (withdrawnAt 표시)
const ANON = 'withdrawn';

export async function POST() {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const active = await orderColl.countDocuments({ email, status: { $in: ['상품 확인중', '배송중', '교환 요청'] } });
  if (active > 0) {
    return NextResponse.json(
      { ok: false, message: '진행 중인 주문이 있어 탈퇴할 수 없습니다. 배송이 끝난 뒤 다시 시도해주세요.' },
      { status: 409 },
    );
  }

  const session = mongodbClient.startSession();
  try {
    await session.withTransaction(async () => {
      await reviewColl.updateMany(
        { 'review.user': email },
        { $set: { 'review.$[r].user': ANON } },
        { arrayFilters: [{ 'r.user': email }], session },
      );
      await qnaColl.updateMany(
        { 'qna.email': email },
        { $set: { 'qna.$[q].email': ANON } },
        { arrayFilters: [{ 'q.email': email }], session },
      );
      await orderColl.updateMany({ email }, { $set: { withdrawnAt: new Date() } }, { session });
      await cartColl.deleteOne({ user: email }, { session });
      await userColl.deleteOne({ email }, { session });
    });
  } catch (err) {
    console.error('회원 탈퇴 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: '탈퇴 처리에 실패했습니다.' }, { status: 500 });
  } finally {
    await session.endSession();
  }
  return NextResponse.json({ ok: true });
}
