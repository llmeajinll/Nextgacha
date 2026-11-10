import type { ErrorStatus } from '../model/types';

// 오류 기록 처리 상태 변경 (관리자). 실패하면 서버 메시지로 throw
export async function setErrorStatus(id: string, status: ErrorStatus) {
  const res = await fetch('/api/postErrorStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '반영하지 못했어요.');
}
