import { NextResponse } from 'next/server';
import { orderColl } from '@/shared/api/mongodb';
import { notifyUser } from '@/shared/api/notifyUser';
import { notifyAdmin } from '@/shared/lib/notifyAdmin';
import { businessDaysBefore, ORDER_CONFIRM_DAYS } from '@/shared/lib/businessDays';
import { refundOrder } from '@/features/purchase/lib/refundOrder';

// 주문 확인 기한 (docs/policies/operations.md "주문 확인 기한"): 결제 후 3영업일 안에 송장이 입력되지 않은
// '상품 확인중' 주문을 자동 환불하고 구매자에게 사이트 알림을 남긴다. vercel.json crons가 매일 09:00 KST에 호출.
// Vercel이 Authorization: Bearer $CRON_SECRET 을 붙여 주므로, 환경변수가 없거나 값이 다르면 거절한다.
// ponytail: 한 번에 20건까지 (Toss 호출이 건당 최대 10초). 밀린 주문이 더 많으면 다음 날 이어서 처리
const BATCH = 20;
const REASON = `결제 후 ${ORDER_CONFIRM_DAYS}영업일 안에 발송하지 못해 자동 환불되었습니다.`;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const overdue = await orderColl
    .find(
      { status: '상품 확인중', created_at: { $lt: businessDaysBefore(ORDER_CONFIRM_DAYS) } },
      { projection: { _id: 0, orderId: 1, email: 1 } },
    )
    .sort({ _id: 1 })
    .limit(BATCH)
    .toArray();

  let refunded = 0;
  for (const { orderId, email } of overdue) {
    // 실패는 refundOrder가 기록·알림한다 (결제 취소 실패면 주문은 그대로 남아 내일 다시 시도)
    const result = await refundOrder(orderId, REASON, { by: 'system' });
    if (!result.ok) continue;
    refunded++;
    await notifyUser(email, `주문 ${orderId}이 발송 지연으로 자동 환불되었습니다. 결제 금액과 사용한 포인트가 돌아갑니다.`, '/mypage/history').catch(
      (e) => console.error('자동 환불 알림 실패:', orderId, e instanceof Error ? e.message : e),
    );
  }

  if (overdue.length > 0) {
    await notifyAdmin(`[Next Gacha] 배송 기한 초과 자동 환불 ${refunded}/${overdue.length}건`, '/manager/order/refund');
  }
  return NextResponse.json({ ok: true, overdue: overdue.length, refunded });
}
