# 개발 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 금액 계산식 단일 출처
- 상태: 확정
- 정책: 금액·배송비·포인트·한도 상수와 계산은 `orderPolicy.ts`에만 둔다. 클라이언트 컴포넌트도 이 파일을 import해서 쓰고, 숫자를 직접 쓰지 않는다.
- 이유: `InfoPanel`은 `orderPolicy.ts`를 쓰지만 `CartTemplate`은 `50000`, `3000`, `0.01`을 하드코딩한다. 배송비 하나만 바꿔도 장바구니 금액과 서버 검증 금액이 달라져서 결제가 전부 거절된다.
- 코드: `src/widgets/CartTemplate/CartTemplate.tsx:80`, `:188`, `:231`, 기준 `src/features/purchase/lib/orderPolicy.ts`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 에러 알림
- 상태: 확정
- 정책:
  - 시스템 에러는 Sentry를 쓰지 않고 Next 기본 훅 `onRequestError`(`src/instrumentation.ts`)로 `errorColl`(`type: 'system'`)에 남긴다. 스택·전체 로그는 Vercel 런타임 로그에서 본다. 관리자는 `/manager/error`에서 확인한다.
  - 돈이나 데이터가 어긋나는 실패(결제 취소 실패, 환불 DB 실패, [결제 대사](./payments.md#결제-대사-toss--주문-맞춰-보기) 불일치)는 기록과 동시에 관리자 카카오톡으로 알린다.
  - `errorColl`은 `type` 필드로 사용자 제보(`report`)와 시스템 에러(`system`)를 나눈다.
- 구현 메모: 카카오톡 알림은 카카오 "나에게 보내기" API를 쓴다. 관리자 계정의 `talk_message` 동의와 refresh token 보관(약 2개월마다 갱신)이 필요하다. 카톡 알림은 위 실패 지점에서 서버가 직접 보낸다(`onRequestError`로 남는 일반 에러는 카톡을 보내지 않음). 토큰 발급·테스트 발송은 `scripts/kakao-admin-token.mjs`.
- 다시 볼 때: 같은 에러가 반복되면 그 수만큼 `errorColl`에 쌓이고(6개월 TTL), 묶어 보기·추세·릴리스별 비교가 없다. Vercel 런타임 로그는 보존 기간이 짧다. 에러가 많아져 `/manager/error`로 감당이 안 되면 Sentry(프로젝트·DSN 필요)를 다시 검토한다.
- 이유: 운영에서는 `console.log`가 제거되고 `console.error`만 남는다. 심각한 실패는 `errorColl`에 쌓이기만 하고 아무도 알림을 받지 못한다. `errorColl`에는 사용자 제보(`postError`)와 시스템 에러가 섞여 있다.
- 코드: `type` 필드는 구현 (`postError`는 `report`, 결제 취소·환불 실패 기록은 `system`, 옛 문서는 pathname으로 판정 — `src/features/error-manage/lib/normalizeError.ts`). 카카오톡 알림은 구현(`src/shared/lib/notifyAdmin.ts`, `src/shared/api/recordSystemError.ts` `notify: true` — 결제 취소 실패, 결제 확인 불가, 환불 DB 실패, 결제 대사. 환경변수 `KAKAO_ADMIN_REFRESH_TOKEN` 필요). 처리되지 않은 서버 에러 `src/instrumentation.ts:6` `onRequestError`(Node 런타임만, 쿼리스트링은 빼고 경로만 기록). `next.config.ts:10`, `src/app/api/postPaymentsConfirm/route.ts` `cancelPayment`, `src/app/api/postCheckToSending/route.ts` `refundOrder`
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (Sentry + 관리자 카카오톡, `type` 필드), 2026-11-16 Sentry 대신 `onRequestError` + Vercel 런타임 로그로 변경·구현

## 로그 개인정보
- 상태: 확정
- 정책: 로그에는 식별자(`orderId`, 에러 코드, 메시지)만 남긴다. 외부 API 응답 전체, 이메일, 주소, `paymentKey`는 남기지 않는다.
- 이유: 지금은 Toss 승인 실패 시 응답 전체를 `console.error`로 남기고, 이 로그는 운영에서도 지워지지 않는다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:63`, `src/app/api/postCheckToSending/route.ts:24`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 테스트 범위
- 상태: 확정
- 정책: 돈·재고·포인트를 바꾸는 변경은 테스트를 같이 쓴다. 순수 함수는 지금처럼 Node 기본 러너로, DB가 필요한 흐름(결제 승인, 환불, 배송 완료)은 테스트 전용 DB `gacha_test`로 테스트한다.
  - `gacha_test`는 테스트마다 쓰는 컬렉션을 비우고 필요한 문서만 넣는다. 지금은 `.env.local`의 DB 계정(운영과 같은 계정)으로 접속하고, 테스트가 `MONGODB_DB=gacha_test`를 직접 넣은 뒤 연결된 DB 이름이 정확히 `gacha_test`가 아니면 아무것도 지우기 전에 멈춘다. 계정 분리는 [환경 분리와 백업](./data.md#환경-분리와-백업)이 되면 그 계정으로 바꾼다.
  - Toss 호출은 `fetch`를 바꿔치기해 기록만 한다(실제 결제 API를 부르지 않음). Toss 외의 외부 호출은 테스트를 실패시킨다.
  - 실행: `pnpm test:db`. 파일 이름은 `*.dbtest.ts`라 `pnpm test`(`*.test.ts`)에는 섞이지 않는다. `@/` 별칭과 확장자 없는 import는 `scripts/ts-alias.mjs`(`node:module` resolve 훅, 의존성 없음)가 풀어 준다.
  - CI에는 DB 비밀값이 없어서 DB 테스트를 돌리지 않는다. 돈·재고·포인트를 바꾸는 PR은 로컬에서 `pnpm test:db`를 돌린 뒤 올린다.
- 이유: 순수 함수 테스트만으로는 트랜잭션 롤백, 상태 필터(두 번 처리 방지), 재고·포인트 복구가 실제로 맞는지 알 수 없다.
- 코드: 순수 함수 `src/**/*.test.ts`(예 `src/features/purchase/lib/orderPolicy.test.ts`), DB 테스트 `src/features/purchase/lib/purchase.dbtest.ts`(결제 4단계 함께 성공·재고 부족 시 함께 롤백, `refundOrder` 재고·포인트·keep 복구와 두 번째 호출 거절, 교환 발송 재고 차감과 재고 부족 시 상태 유지), 로더 `scripts/ts-alias.mjs`, 스크립트 `package.json` `test:db`, CI `.github/workflows/ci.yml`(`pnpm test`만)
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (돈·재고·포인트 변경 시 필수, `gacha_test`), 2026-11-16 DB 테스트 구현 (현재 DB 계정 + DB 이름 확인, CI 제외)

## 보안 헤더
- 상태: 확정
- 정책: `next.config.ts`의 `headers()`로 기본 보안 헤더(`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)를 건다. CSP는 Toss SDK, 카카오, Vercel Blob 출처를 정리한 뒤에 따로 건다.
- 이유: 지금은 보안 헤더가 하나도 없다.
- 코드: `next.config.ts:20` (CSP는 아직)
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정, 2026-11-15 구현
