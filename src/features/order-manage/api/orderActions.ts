// 관리자 주문 상태 변경. 실패하면 서버 메시지로 throw
async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '반영하지 못했어요.');
  return data;
}

type Ship = { orderId: string; courier: string; invoice: string };

// 상품 확인중 → 배송중 (송장 필수)
export const toSending = (orders: Ship[]) =>
  orders.length === 1
    ? post('/api/postCheckToSending', { send: 'one', ...orders[0] })
    : post('/api/postCheckToSending', { send: 'many', orders });

// 배송중 → 배송 완료 (적립금 지급은 서버가 주문 문서 기준으로)
export const toArrive = (orderIds: string[]) =>
  post('/api/postSendingToFinish', { send: 'many', orders: orderIds.map((orderId) => ({ orderId })) });

// 교환 요청 → 교환 완료 (같은 상품을 다시 보냄, 재고 차감) / 반려 (배송 완료로, 사유 10자 이상)
export const exchangeDone = (orderId: string) => post('/api/postExchange', { orderId, action: 'done' });
export const exchangeReject = (orderId: string, reason: string) =>
  post('/api/postExchange', { orderId, action: 'reject', reason });

// 상품 확인중 → 환불 (결제 취소 + 재고·포인트 복구)
export const refundOrder = (orderId: string, reason: string) =>
  post('/api/postCheckToSending', { send: 'refund', orderId, reason });
