// 사용자 오류 신고. 지금 보고 있는 화면 주소를 같이 보낸다. 성공하면 true
export default async function postErrorReport(text: string, pathname: string) {
  const res = await fetch('/api/postError', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textareaValue: text, pathname: decodeURIComponent(pathname) }),
  }).catch(() => null);
  const data = await res?.json().catch(() => null);
  return data?.ok === true;
}
