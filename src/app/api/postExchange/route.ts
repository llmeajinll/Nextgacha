import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { orderColl } from '@/shared/api/mongodb';
import { logAdmin } from '@/shared/api/adminLog';
import { notifyUser } from '@/shared/api/notifyUser';
import { shipExchange } from '@/features/purchase/lib/shipExchange';

const REQUESTED = '교환 요청';

// 관리자 교환 처리 (proxy ADMIN_API_PATHS). done: 같은 상품을 다시 보내므로 그 수량만큼 재고를 뺀다 (불량품은 폐기)
// reject: 배송 완료로 되돌리고 사유를 남긴다. 둘 다 구매자에게 사이트 알림
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const orderId = typeof body.orderId === 'string' && body.orderId.length <= 100 ? body.orderId : '';
  const action = body.action;
  const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
  if (!orderId || (action !== 'done' && action !== 'reject') || (action === 'reject' && (reason.length < 10 || reason.length > 200))) {
    return NextResponse.json({ ok: false, message: '잘못된 요청이에요.' }, { status: 400 });
  }
  const admin = (await auth())?.user?.email;

  if (action === 'reject') {
    const order = await orderColl.findOneAndUpdate(
      { orderId, status: REQUESTED },
      { $set: { status: '배송 완료', exchangeRejected: reason } },
    );
    if (!order) return NextResponse.json({ ok: false, message: '이미 처리된 주문이에요.' }, { status: 409 });
    await notifyUser(order.email, `주문 ${orderId}의 교환 요청이 반려되었습니다. 사유: ${reason}`, '/mypage/history').catch(() => {});
    await logAdmin(admin, { action: 'exchange', target: orderId, before: { status: REQUESTED }, after: { status: '배송 완료', reason } });
    return NextResponse.json({ ok: true });
  }

  try {
    const order = await shipExchange(orderId);
    await notifyUser(order.email, `주문 ${orderId}의 교환 상품을 다시 보내드립니다.`, '/mypage/history').catch(() => {});
    await logAdmin(admin, { action: 'exchange', target: orderId, before: { status: REQUESTED }, after: { status: '교환 완료', list: order.list } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : '교환 처리에 실패했어요.';
    return NextResponse.json(
      { ok: false, message: message.includes('재고') ? '재고가 부족해 교환 상품을 보낼 수 없어요. 재고를 채운 뒤 다시 시도해 주세요.' : message },
      { status: 409 },
    );
  }
}
