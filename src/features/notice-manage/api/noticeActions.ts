import type { NoticeForm } from '../lib/parseNoticeForm';

// 관리자 공지 저장·삭제·이미지. 실패하면 서버 메시지로 throw
async function send<T = Record<string, unknown>>(url: string, body: BodyInit, json = true): Promise<T> {
  const res = await fetch(url, { method: 'POST', ...(json && { headers: { 'Content-Type': 'application/json' } }), body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '반영하지 못했어요.');
  return data;
}

export const saveNotice = (form: NoticeForm & { num?: number }) =>
  send<{ num: number }>('/api/postNotice', JSON.stringify(form)).then((d) => d.num);

export const deleteNotice = (num: number) => send('/api/postNoticeDelete', JSON.stringify({ num }));

export const uploadNoticeImage = (file: File) => {
  const fd = new FormData();
  fd.set('image', file);
  return send<{ url: string }>('/api/postNoticeImage', fd, false).then((d) => d.url);
};
