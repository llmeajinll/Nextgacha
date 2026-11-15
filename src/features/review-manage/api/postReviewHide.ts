// 실패하면 서버 메시지로 throw
export default async function postReviewHide(body: { num: number; orderId: string; hidden: boolean; reason: string }) {
  const res = await fetch('/api/postReviewHide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) throw new Error(data.message ?? '반영하지 못했어요.');
}
