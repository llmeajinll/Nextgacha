// discount 0이면 할인을 내린다. start·end는 'YYYY-MM-DD' (KST), 비우면 기간 제한 없음
type EventInput = { discount: number; nums: number[]; start?: string; end?: string };
const kstMidnight = (d?: string) => (d ? new Date(`${d}T00:00:00+09:00`).toISOString() : undefined);

export default async function postEvent({ start, end, ...event }: EventInput): Promise<void> {
  const res = await fetch('/api/postEvent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...event, start: kstMidnight(start), end: kstMidnight(end) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message ?? '반영하지 못했어요.');
}
