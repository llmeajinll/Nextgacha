import type { AdminUserDetail } from '../model/types';

export default async function getUserDetail(id: string): Promise<AdminUserDetail> {
  const res = await fetch(`/api/getUserDetail?id=${encodeURIComponent(id)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '회원 정보를 불러오지 못했어요.');
  return data.result;
}
