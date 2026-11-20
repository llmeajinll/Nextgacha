import type { OrderView } from '../model/types';

// 마이페이지 주문 내역 한 페이지. 실패하면 null (화면은 이전 값을 그대로 둔다)
export default async function getHistory(page: number): Promise<{ historyResult: OrderView[]; total: number } | null> {
  try {
    const res = await fetch(`/api/protected/getHistory?page=${page}`);
    const data = await res.json();
    return data.ok === true ? data.result : null;
  } catch (err) {
    console.error('fetch getHistory error:', err);
    return null;
  }
}
