// 문의 답변 등록·수정. 실패하면 서버 메시지로 throw
export default async function postQnaAnswer(body: { num: number; qna_num: number; content: string; edit: boolean }) {
  const res = await fetch('/api/postQnaAnswer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '답변을 저장하지 못했어요.');
}
