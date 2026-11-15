// TossPayments 서버 API (시크릿 키 사용 — 서버에서만 import)
const TOSS_API = 'https://api.tosspayments.com/v1/payments';
// 외부 호출 타임아웃 (docs/policies/infra.md, payments.md "Toss 요청 타임아웃")
const TIMEOUT_MS = 10_000;

// 시크릿 키는 NEXT_PUBLIC_ 접두어 금지 (클라이언트 번들 노출 위험)
function tossHeaders(idempotencyKey?: string) {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new Error('TOSS_SECRET_KEY 환경변수가 없습니다.');
  return {
    Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
    'Content-Type': 'application/json',
    // 같은 키로 다시 보내면 Toss가 첫 응답을 돌려준다 → 재시도해도 두 번 처리되지 않음
    ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey }),
  };
}

const toss = (path: string, init: { method?: string; body?: unknown; idempotencyKey?: string } = {}) =>
  fetch(`${TOSS_API}${path}`, {
    method: init.method ?? 'GET',
    headers: tossHeaders(init.idempotencyKey),
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

export const isTimeout = (err: unknown) =>
  err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError');

// 타임아웃이면 throw (승인 여부를 모르는 상태 → 호출한 쪽이 조회로 확인)
export async function confirmTossPayment(body: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const res = await toss('/confirm', {
    method: 'POST',
    body,
    idempotencyKey: `confirm-${body.orderId}`,
  });
  return res.json();
}

// 실패 시 throw. reason은 키 구분값 (같은 주문을 같은 이유로 두 번 취소하지 않게)
export async function cancelTossPayment(
  paymentKey: string,
  cancelReason: string,
  key: { orderId: string; reason: 'order-failed' | 'refund' | 'user-cancel' | 'reconcile' },
) {
  const res = await toss(`/${paymentKey}/cancel`, {
    method: 'POST',
    body: { cancelReason },
    idempotencyKey: `cancel-${key.orderId}-${key.reason}`,
  });
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
}

export type TossPayment = { paymentKey: string; orderId: string; status: string; approvedAt?: string };

// 결제가 없으면(404) null, 그 외 실패는 throw
export async function getTossPaymentByOrderId(orderId: string): Promise<TossPayment | null> {
  const res = await toss(`/orders/${encodeURIComponent(orderId)}`);
  if (res.status === 404) return null;
  const payment = await res.json();
  if (!res.ok || !payment.paymentKey) throw new Error(JSON.stringify(payment));
  return payment;
}

export async function getTossPayment(paymentKey: string): Promise<TossPayment> {
  const res = await toss(`/${encodeURIComponent(paymentKey)}`);
  const payment = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(payment));
  return payment;
}

// paymentKey를 저장하지 않던 옛 주문은 orderId로 조회해서 취소
export async function cancelOrderPayment(
  order: { orderId: string; paymentKey?: string },
  cancelReason: string,
  reason: 'refund' | 'user-cancel',
) {
  let paymentKey = order.paymentKey;
  if (!paymentKey) {
    const payment = await getTossPaymentByOrderId(order.orderId);
    if (!payment) throw new Error(`결제를 찾을 수 없음 orderId=${order.orderId}`);
    paymentKey = payment.paymentKey;
  }
  await cancelTossPayment(paymentKey, cancelReason, { orderId: order.orderId, reason });
}
