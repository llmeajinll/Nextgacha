// 관리자 카카오톡 "나에게 보내기" (docs/policies/engineering.md "에러 알림")
// 필요 환경변수: KAKAO_CLIENT_ID(REST 키, 로그인과 같은 앱), KAKAO_CLIENT_SECRET, KAKAO_ADMIN_REFRESH_TOKEN
// (관리자 계정으로 talk_message 동의 후 받은 refresh token). 없으면 아무것도 하지 않는다.
// ponytail: refresh token을 환경변수로 둬서 약 2개월마다 수동 교체. 자동 갱신이 필요하면 DB에 저장
import { baseUrl } from '../api/baseUrl';

const TIMEOUT_MS = 10_000;

async function accessToken(refreshToken: string) {
  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.KAKAO_CLIENT_ID ?? '',
      refresh_token: refreshToken,
      ...(process.env.KAKAO_CLIENT_SECRET && { client_secret: process.env.KAKAO_CLIENT_SECRET }),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`카카오 토큰 갱신 실패 ${data.error_code ?? res.status}`);
  // 만료 1개월 전부터 새 refresh token이 같이 온다 → 환경변수를 바꿔야 함
  if (data.refresh_token) console.warn('KAKAO_ADMIN_REFRESH_TOKEN 교체 필요 (새 토큰 발급됨)');
  return data.access_token as string;
}

// 실패해도 throw하지 않는다 (알림 때문에 원래 처리가 깨지면 안 됨)
export async function notifyAdmin(text: string, link = '/manager/error') {
  const refreshToken = process.env.KAKAO_ADMIN_REFRESH_TOKEN;
  if (!refreshToken) return;
  try {
    const url = new URL(link, baseUrl).toString();
    const res = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await accessToken(refreshToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          text: text.slice(0, 200),
          link: { web_url: url, mobile_web_url: url },
        }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) console.error('관리자 알림 실패', res.status);
  } catch (err) {
    console.error('관리자 알림 실패', err instanceof Error ? err.message : err);
  }
}
