// 재입고 예정 시각을 정하고 알림 신청자에게 사이트 알림을 보낸다. at은 datetime-local 값 (KST로 해석)
export default async function postRestock(num: number, at: string): Promise<{ notified: number }> {
  const res = await fetch('/api/postRestock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num, at: new Date(`${at}:00+09:00`).toISOString() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) throw new Error(data.message ?? '반영하지 못했어요.');
  return data;
}
