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
  - 시스템 에러는 Sentry로 모은다.
  - 돈이나 데이터가 어긋나는 실패(결제 취소 실패, 환불 DB 실패, [결제 대사](./payments.md#결제-대사-toss--주문-맞춰-보기) 불일치)는 기록과 동시에 관리자 카카오톡으로 알린다.
  - `errorColl`은 `type` 필드로 사용자 제보(`report`)와 시스템 에러(`system`)를 나눈다.
- 구현 메모: 카카오톡 알림은 카카오 "나에게 보내기" API를 쓴다. 관리자 계정의 `talk_message` 동의와 refresh token 보관(약 2개월마다 갱신)이 필요하다. Sentry는 카카오톡 연동이 없어서, 카톡 알림은 위 실패 지점에서 서버가 직접 보낸다.
- 이유: 운영에서는 `console.log`가 제거되고 `console.error`만 남는다. 심각한 실패는 `errorColl`에 쌓이기만 하고 아무도 알림을 받지 못한다. `errorColl`에는 사용자 제보(`postError`)와 시스템 에러가 섞여 있다.
- 코드: `type` 필드는 구현 (`postError`는 `report`, 결제 취소·환불 실패 기록은 `system`, 옛 문서는 pathname으로 판정 — `src/features/error-manage/lib/normalizeError.ts`). Sentry·카카오톡 알림은 미구현. `next.config.ts:10`, `src/app/api/postPaymentsConfirm/route.ts` `cancelPayment`, `src/app/api/postCheckToSending/route.ts` `refundOrder`
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (Sentry + 관리자 카카오톡, `type` 필드)

## 로그 개인정보
- 상태: 확정
- 정책: 로그에는 식별자(`orderId`, 에러 코드, 메시지)만 남긴다. 외부 API 응답 전체, 이메일, 주소, `paymentKey`는 남기지 않는다.
- 이유: 지금은 Toss 승인 실패 시 응답 전체를 `console.error`로 남기고, 이 로그는 운영에서도 지워지지 않는다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:63`, `src/app/api/postCheckToSending/route.ts:24`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 테스트 범위
- 상태: 확정
- 정책: 돈·재고·포인트를 바꾸는 변경은 테스트를 같이 쓴다. 순수 함수는 지금처럼 Node 기본 러너로, DB가 필요한 흐름(결제 승인, 환불, 배송 완료)은 테스트 전용 DB `gacha_test`로 테스트한다.
  - `gacha_test`는 테스트마다 비우고 필요한 문서만 넣는다. 운영 `gacha`에는 접근할 수 없는 DB 사용자로 접속한다([환경 분리와 백업](./data.md#환경-분리와-백업)).
- 이유: 테스트는 `orderPolicy`, `comma`, `koreaTime` 3개뿐이다. 가장 위험한 결제·환불·배송 완료 흐름은 테스트가 없다.
- 코드: `src/features/purchase/lib/orderPolicy.test.ts`, `.github/workflows/ci.yml` (DB 테스트 미구현)
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (돈·재고·포인트 변경 시 필수, `gacha_test`)

## 보안 헤더
- 상태: 확정
- 정책: `next.config.ts`의 `headers()`로 기본 보안 헤더(`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)를 건다. CSP는 Toss SDK, 카카오, Vercel Blob 출처를 정리한 뒤에 따로 건다.
- 이유: 지금은 보안 헤더가 하나도 없다.
- 코드: `next.config.ts`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정
