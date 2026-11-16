import type { Instrumentation } from 'next';

// 처리되지 않은 서버 에러(라우트·서버 컴포넌트의 5xx)를 errorColl에 남긴다 (docs/policies/engineering.md "에러 알림").
// Sentry 대신 Next 기본 훅 + Vercel 런타임 로그를 쓴다. 관리자 에러 화면(/manager/error)에서 본다.
// ponytail: 같은 에러가 반복되면 그만큼 쌓인다(6개월 TTL). 묶어 보기·추세가 필요해지면 Sentry 도입
export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  // mongodb는 Node 런타임에서만 (proxy는 다른 런타임일 수 있음)
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { recordSystemError } = await import('@/shared/api/recordSystemError');
  const e = err as Error & { digest?: string };
  // 쿼리스트링에는 검색어·결제 키가 들어올 수 있어 경로만 남긴다
  const path = request.path.split('?')[0];
  await recordSystemError(`[서버 에러] ${request.method} ${path} ${e.name}: ${e.message} digest=${e.digest ?? ''}`.slice(0, 1000), path);
};
