import { cookies, headers } from 'next/headers';
import { koreaTime } from './koreaTime';

// 다른 계정 중복 구매 표시용 신호 (서버 전용). 쿠키는 사용자가 바꿀 수 있으므로 UUID 형식만 받는다.
// x-forwarded-for는 Vercel이 덮어쓰므로 첫 값이 실제 클라이언트 IP (Vercel 밖으로 옮기면 다시 확인)
export async function clientSignals() {
  const did = (await cookies()).get('did')?.value;
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim().slice(0, 45) || null;
  return { deviceId: did && /^[0-9a-f-]{36}$/.test(did) ? did : null, ip, at: koreaTime() };
}
