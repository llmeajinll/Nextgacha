import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { refundOrder } from '@/features/purchase/lib/refundOrder';

// 구매자 주문 취소 (docs/policies/refunds.md "구매자 주문 취소"): 상품 확인중(송장 입력 전)인 자기 주문만.
// 관리자 환불과 같은 흐름(Toss 취소 → 재고·keep·usedPoint 복구)을 쓴다
export async function POST(req: Request) {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const { orderId } = await req.json().catch(() => ({}));
  if (typeof orderId !== 'string' || orderId.length === 0 || orderId.length > 100) {
    return NextResponse.json({ ok: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }

  // email 조건으로 남의 주문은 찾지 못한다
  const result = await refundOrder(orderId, '구매자 주문 취소', { email, by: 'user' });
  if (!result.ok) return NextResponse.json(result, { status: result.status });
  return NextResponse.json({ ok: true }, { status: 200 });
}
