import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { orderColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';

// 불량품 교환 요청 (docs/policies/refunds.md "배송 후 반품/교환"): 배송 완료된 자기 주문만. 환불은 없고 같은 상품을 다시 보낸다
export async function POST(req: Request) {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const orderId = typeof body.orderId === 'string' ? body.orderId : '';
  const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
  if (!orderId || orderId.length > 100 || reason.length < 10 || reason.length > 500) {
    return NextResponse.json({ ok: false, message: '불량 내용을 10자 이상 적어 주세요.' }, { status: 400 });
  }

  // status 필터로 중복 요청·다른 상태의 주문은 아무 일도 일어나지 않는다
  const result = await orderColl.updateOne(
    { orderId, email, status: '배송 완료' },
    { $set: { status: '교환 요청', exchangeReason: reason, exchangeRequestedDate: koreaTime() }, $unset: { exchangeRejected: '' } },
  );
  if (result.modifiedCount === 0) {
    return NextResponse.json({ ok: false, message: '교환을 요청할 수 없는 주문입니다.' }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
