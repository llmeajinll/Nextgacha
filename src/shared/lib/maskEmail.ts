// 이메일을 화면 표시용으로 마스킹: abcdef@x.com → abc***
// API 응답에 이메일 원문을 내보내지 않기 위해 서버에서 사용
export function maskEmail(email?: string | null) {
  if (!email) return '';
  const [id] = email.split('@');
  if (id.length <= 3) return '*'.repeat(id.length);
  return id.slice(0, 3) + '*'.repeat(id.length - 3);
}
