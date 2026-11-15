// 실패하면 서버 메시지로 throw
export default async function withdraw(): Promise<void> {
  const res = await fetch('/api/protected/postWithdraw', { method: 'POST' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) throw new Error(data.message ?? '탈퇴 처리에 실패했습니다.');
}
