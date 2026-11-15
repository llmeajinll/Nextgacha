import { errorColl } from './mongodb';
import { koreaTime } from '../lib/koreaTime';
import { notifyAdmin } from '../lib/notifyAdmin';

// 시스템 에러 6개월 보존 (TTL 인덱스가 createdAt 기준으로 지움 — scripts/migrations/2026-11-15-indexes.mjs)
// 돈·데이터가 어긋난 실패는 notify: true → 관리자 카카오톡 (docs/policies/engineering.md "에러 알림")
// 실패해도 throw하지 않는다 (이미 돈이 오간 뒤에 부르는 곳이 많음)
export async function recordSystemError(
  message: string,
  pathname: string,
  { notify = false }: { notify?: boolean } = {},
) {
  await errorColl
    .insertOne({
      textareaValue: message,
      pathname,
      type: 'system',
      status: '접수',
      created_at: koreaTime(),
      createdAt: new Date(),
    })
    .catch((e) => console.error('에러 기록 실패:', e instanceof Error ? e.message : e));
  if (!notify) return;
  // 카톡에는 분류와 orderId만 (paymentKey·에러 원문은 관리자 에러 화면에서 확인)
  const tag = message.match(/^\[[^\]]+\]/)?.[0] ?? '[시스템 에러]';
  const orderId = message.match(/orderId=\S+/)?.[0] ?? '';
  await notifyAdmin(`[Next Gacha] ${tag} ${orderId}`.trim());
}
