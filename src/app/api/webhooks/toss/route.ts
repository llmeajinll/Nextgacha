import { after, NextResponse } from 'next/server';
import { orderColl } from '@/shared/api/mongodb';
import { recordSystemError } from '@/shared/api/recordSystemError';
import { cancelTossPayment, getTossPayment } from '@/features/purchase/lib/toss';

// 결제 대사 (docs/policies/payments.md "결제 대사"): Toss 웹훅(PAYMENT_STATUS_CHANGED)을 받아
// DONE인데 주문이 없는 결제를 찾아 취소한다. Toss 개발자센터 웹훅에 https://<도메인>/api/webhooks/toss 등록 필요.
// 공개 엔드포인트라 본문은 믿지 않고 paymentKey로 Toss에 다시 조회한 값만 쓴다.
const PATH = '/api/webhooks/toss';
// 승인 직후엔 postPaymentsConfirm 트랜잭션이 아직 진행 중일 수 있어서 기다렸다가 확인
const GRACE_MS = 60_000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const paymentKey = body?.data?.paymentKey;
  if (body?.eventType !== 'PAYMENT_STATUS_CHANGED' || typeof paymentKey !== 'string' || paymentKey.length > 200) {
    // 다른 이벤트는 무시 (200을 줘야 Toss가 재전송하지 않음)
    return NextResponse.json({ ok: true });
  }
  if (body.data.status !== 'DONE') return NextResponse.json({ ok: true });

  // 응답은 바로 주고, 확인은 응답 뒤에 (Toss 웹훅은 10초 안에 응답해야 함)
  after(() => reconcile(paymentKey));
  return NextResponse.json({ ok: true });
}

async function reconcile(paymentKey: string) {
  await new Promise((r) => setTimeout(r, GRACE_MS));
  let orderId = '';
  try {
    const payment = await getTossPayment(paymentKey);
    orderId = payment.orderId;
    if (payment.status !== 'DONE') return;
    if (await orderColl.findOne({ orderId }, { projection: { _id: 1 } })) return;

    // 돈은 빠졌는데 주문이 없다 → 취소
    await cancelTossPayment(paymentKey, '주문 처리 실패 (결제 대사)', { orderId, reason: 'reconcile' });
    await recordSystemError(
      `[결제 대사 - 주문 없는 결제 자동 취소] orderId=${orderId} paymentKey=${paymentKey}`,
      PATH,
      { notify: true },
    );
  } catch (err) {
    await recordSystemError(
      `[결제 대사 실패] orderId=${orderId || '알 수 없음'} paymentKey=${paymentKey} error=${String(err)}`,
      PATH,
      { notify: true },
    );
  }
}
