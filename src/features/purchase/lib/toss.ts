// TossPayments 서버 API (시크릿 키 사용 — 서버에서만 import)
const TOSS_API = 'https://api.tosspayments.com/v1/payments';

// 시크릿 키는 NEXT_PUBLIC_ 접두어 금지 (클라이언트 번들 노출 위험)
function tossHeaders() {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new Error('TOSS_SECRET_KEY 환경변수가 없습니다.');
  return {
    Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
    'Content-Type': 'application/json',
  };
}

export async function confirmTossPayment(body: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const res = await fetch(`${TOSS_API}/confirm`, {
    method: 'POST',
    headers: tossHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

// 실패 시 throw
export async function cancelTossPayment(paymentKey: string, cancelReason: string) {
  const res = await fetch(`${TOSS_API}/${paymentKey}/cancel`, {
    method: 'POST',
    headers: tossHeaders(),
    body: JSON.stringify({ cancelReason }),
  });
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
}

// 주문에 paymentKey를 저장하지 않던 기존 주문도 orderId로 취소할 수 있게 조회
export async function cancelTossPaymentByOrderId(orderId: string, cancelReason: string) {
  const res = await fetch(`${TOSS_API}/orders/${encodeURIComponent(orderId)}`, {
    headers: tossHeaders(),
  });
  const payment = await res.json();
  if (!res.ok || !payment.paymentKey) throw new Error(JSON.stringify(payment));
  await cancelTossPayment(payment.paymentKey, cancelReason);
}
