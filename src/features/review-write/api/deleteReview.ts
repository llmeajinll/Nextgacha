// 실패하면 서버 메시지로 throw
export default async function deleteReview(num: number, orderId: string): Promise<void> {
  const res = await fetch('/api/protected/deleteReview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num, orderId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) throw new Error(data.message ?? '리뷰를 삭제하지 못했습니다.');
}
