import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { orderColl } from '@/shared/api/mongodb';
import { logAdmin } from '@/shared/api/adminLog';
import { refundOrder } from '@/features/purchase/lib/refundOrder';

const CHECKING = '상품 확인중';

// Mongo 필터·$set에 넣기 전에 문자열인지, 길이가 맞는지 확인 (객체면 연산자로 해석됨)
const str = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

const parseShip = (o: { orderId?: unknown; courier?: unknown; invoice?: unknown } | null | undefined) => {
  const orderId = str(o?.orderId, 100);
  const courier = str(o?.courier, 30);
  const invoice = str(o?.invoice, 30);
  return orderId && courier && invoice ? { orderId, courier, invoice } : null;
};

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const { send } = data;
  const admin = (await auth())?.user?.email;
  const invalid = () => NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });

  // 한개
  if (send === 'one') {
    const ship = parseShip(data);
    if (!ship) return invalid();
    const { orderId, courier, invoice } = ship;
    const result = await orderColl.updateOne(
      { orderId, status: CHECKING },
      { $set: { courier, invoice, status: '배송중' } },
    );
    if (result.modifiedCount === 1) {
      await logAdmin(admin, { action: 'invoice', target: orderId, before: null, after: { courier, invoice } });
    }
    return NextResponse.json(
      { ok: result.modifiedCount === 1, result },
      { status: result.modifiedCount === 1 ? 200 : 400 },
    );
  }
  // 여러개
  else if (send === 'many') {
    const orders = Array.isArray(data.orders) && data.orders.length <= 100 ? data.orders.map(parseShip) : [];
    if (orders.length === 0 || orders.some((o: unknown) => !o)) return invalid();
    try {
      const result = await orderColl.bulkWrite(
        orders.map((order: { orderId: string; courier: string; invoice: string }) => ({
          updateOne: {
            filter: { orderId: order.orderId, status: CHECKING },
            update: {
              $set: {
                courier: order.courier,
                invoice: order.invoice,
                status: '배송중',
              },
            },
          },
        })),
      );
      // ponytail: bulkWrite는 어떤 주문이 실제로 바뀌었는지 안 알려줘서 요청한 주문 전체를 기록. 정확히 하려면 주문별 updateOne
      await logAdmin(
        admin,
        orders.map((o: { orderId: string; courier: string; invoice: string }) => ({
          action: 'invoice' as const,
          target: o.orderId,
          before: null,
          after: { courier: o.courier, invoice: o.invoice },
        })),
      );
      return NextResponse.json({ ok: true, modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
      console.error('주문 업데이트 중 에러 발생:', error);
      return NextResponse.json({ ok: false, result: {} }, { status: 400 });
    }
  }
  // 환불
  else if (send === 'refund') {
    const orderId = str(data.orderId, 100);
    // 고객에게 보이는 환불 사유 (화면에서도 10자 이상 받음)
    const reason = str(data.reason, 200);
    if (!orderId || !reason || reason.length < 10) return invalid();
    const result = await refundOrder(orderId, reason, { by: 'admin' });
    if (!result.ok) return NextResponse.json(result, { status: result.status });
    await logAdmin(admin, {
      action: 'refund',
      target: orderId,
      before: { status: '상품 확인중', totalPrice: result.order.totalPrice },
      after: { status: '환불', reason },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ ok: false, message: 'invalid send' }, { status: 400 });
}
