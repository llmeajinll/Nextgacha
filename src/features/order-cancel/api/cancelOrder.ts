// 실패하면 서버 메시지로 throw
export default async function cancelOrder(orderId: string): Promise<void> {
  const res = await fetch('/api/protected/postCancelOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) throw new Error(data.message ?? '주문을 취소하지 못했습니다.');
}
