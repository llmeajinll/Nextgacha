# 개발 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 금액 계산식 단일 출처
- 상태: 제안
- 정책: 금액·배송비·포인트·한도 상수와 계산은 `orderPolicy.ts`에만 둔다. 클라이언트 컴포넌트도 이 파일을 import해서 쓰고, 숫자를 직접 쓰지 않는다.
- 이유: `InfoPanel`은 `orderPolicy.ts`를 쓰지만 `CartTemplate`은 `50000`, `3000`, `0.01`을 하드코딩한다. 배송비 하나만 바꿔도 장바구니 금액과 서버 검증 금액이 달라져서 결제가 전부 거절된다.
- 코드: `src/widgets/CartTemplate/CartTemplate.tsx:80`, `:188`, `:231`, 기준 `src/features/purchase/lib/orderPolicy.ts`
- 변경 이력: 2026-11-09 신설

## 에러 알림
- 상태: 미정
- 정책: 미정. 돈이나 데이터가 어긋나는 실패(결제 취소 실패, 환불 DB 실패, [결제 대사](./payments.md) 불일치)는 기록과 동시에 관리자에게 알린다.
- 결정할 것: 알림 채널(이메일, 슬랙, 모니터링 서비스), 사용자 제보와 시스템 에러를 컬렉션이나 `type` 필드로 나눌지
- 이유: 운영에서는 `console.log`가 제거되고 `console.error`만 남는다. 심각한 실패는 `errorColl`에 쌓이기만 하고 아무도 알림을 받지 못한다. `errorColl`에는 사용자 제보(`postError`)와 시스템 에러가 섞여 있다.
- 코드: `next.config.ts:10`, `src/app/api/postPaymentsConfirm/route.ts` `cancelPayment`, `src/app/api/postCheckToSending/route.ts` `refundOrder`
- 변경 이력: 2026-11-09 신설

## 로그 개인정보
- 상태: 제안
- 정책: 로그에는 식별자(`orderId`, 에러 코드, 메시지)만 남긴다. 외부 API 응답 전체, 이메일, 주소, `paymentKey`는 남기지 않는다.
- 이유: 지금은 Toss 승인 실패 시 응답 전체를 `console.error`로 남기고, 이 로그는 운영에서도 지워지지 않는다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:63`, `src/app/api/postCheckToSending/route.ts:24`
- 변경 이력: 2026-11-09 신설

## 테스트 범위
- 상태: 미정
- 정책: 미정. 추천안은 "돈·재고·포인트를 바꾸는 변경은 테스트 필수".
- 결정할 것: 결제·환불·배송 완료 흐름을 어떤 방식으로 테스트할지. 지금 테스트는 Node 기본 러너로 순수 함수만 다룬다. DB가 필요한 흐름은 테스트 전용 DB나 in-memory Mongo가 필요하다.
- 이유: 테스트는 `orderPolicy`, `comma`, `koreaTime` 3개뿐이다. 가장 위험한 결제·환불·배송 완료 흐름은 테스트가 없다.
- 코드: `src/features/purchase/lib/orderPolicy.test.ts`, `.github/workflows/ci.yml`
- 변경 이력: 2026-11-09 신설

## 보안 헤더
- 상태: 제안
- 정책: `next.config.ts`의 `headers()`로 기본 보안 헤더(`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)를 건다. CSP는 Toss SDK, 카카오, Vercel Blob 출처를 정리한 뒤에 따로 건다.
- 이유: 지금은 보안 헤더가 하나도 없다.
- 코드: `next.config.ts`
- 변경 이력: 2026-11-09 신설
