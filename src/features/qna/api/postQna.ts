// 상품 문의 등록. 성공 여부만 돌려준다 (이메일은 서버가 세션에서 다시 읽는다)
export default async function postQna(data: { num: string; email: string; question: string; secret: boolean }) {
  const res = await fetch('/api/protected/postQna', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok;
}
