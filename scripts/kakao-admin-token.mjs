// 관리자 카톡 알림용 refresh token 발급 (src/shared/lib/notifyAdmin.ts, docs/policies/engineering.md "에러 알림")
// 준비: Kakao Developers > 카카오 로그인 > 동의항목에서 "카카오톡 메시지 전송(talk_message)"을 선택 동의로 켠다.
// 1) node --env-file=.env.local scripts/kakao-admin-token.mjs
//    → 출력된 주소를 관리자 카카오 계정으로 열고 동의. localhost:3000/...?code=XXXX 로 돌아오면 주소창의 code 복사
//      (NextAuth 화면이 에러를 보여도 괜찮다. code만 필요)
// 2) node --env-file=.env.local scripts/kakao-admin-token.mjs <code>
//    → 토큰을 받아 테스트 카톡을 보내고, Vercel에 넣을 refresh token을 출력한다. code는 한 번만, 몇 분 안에 써야 한다.
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/kakao'; // 카카오 로그인에 이미 등록된 주소
const clientId = process.env.KAKAO_CLIENT_ID;
if (!clientId) {
  console.error('KAKAO_CLIENT_ID가 없습니다. --env-file=.env.local 로 실행하세요.');
  process.exit(1);
}

const code = process.argv[2];
if (!code) {
  const url = new URL('https://kauth.kakao.com/oauth/authorize');
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: REDIRECT_URI, response_type: 'code', scope: 'talk_message' });
  console.log('관리자 카카오 계정으로 아래 주소를 열고 동의하세요:\n' + url);
  process.exit(0);
}

const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    code,
    ...(process.env.KAKAO_CLIENT_SECRET && { client_secret: process.env.KAKAO_CLIENT_SECRET }),
  }),
});
const token = await tokenRes.json();
if (!tokenRes.ok) {
  console.error('토큰 발급 실패:', token.error_code ?? token.error, token.error_description ?? '');
  process.exit(1);
}
if (!String(token.scope ?? '').includes('talk_message')) {
  console.error('talk_message 동의가 빠졌습니다. 동의항목 설정을 확인하고 1)부터 다시 하세요.');
  process.exit(1);
}

const sendRes = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    template_object: JSON.stringify({
      object_type: 'text',
      text: '[Next Gacha] 관리자 알림 테스트',
      link: { web_url: 'https://nextgacha.vercel.app/manager/error', mobile_web_url: 'https://nextgacha.vercel.app/manager/error' },
    }),
  }),
});
console.log(sendRes.ok ? '테스트 카톡을 보냈습니다. 카카오톡 "나와의 채팅"을 확인하세요.' : `테스트 카톡 실패 (${sendRes.status})`);
console.log(`\nrefresh token (약 ${Math.round((token.refresh_token_expires_in ?? 0) / 86400)}일 유효). Vercel에 넣기:`);
console.log('  vercel env add KAKAO_ADMIN_REFRESH_TOKEN production --sensitive');
console.log('\n' + token.refresh_token);
