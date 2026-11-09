# 주문/결제 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 결제 시 배송지 검증
- 상태: 제안
- 정책: 결제 승인 전에 서버에서 `address`가 비어 있지 않은 문자열이고 200자 이하인지 확인한다. 실패하면 Toss 승인 전에 거절한다.
- 예외: 없음
- 이유: 지금은 요청 본문의 `address`를 그대로 주문에 저장해서, 배송지가 빈 주문이 생길 수 있다. 길이 기준은 `updateAddress`의 기존 검증과 맞춘다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:29` (검증 없음), 기준 `src/app/api/updateAddress/route.ts`
- 변경 이력: 2026-11-09 신설

## 결제 대사 (Toss ↔ 주문 맞춰 보기)
- 상태: 제안
- 정책: Toss 결제 내역과 `orderColl`을 맞춰 보는 경로를 둔다. 추천안은 Toss 웹훅(결제 상태 변경)을 받아서, `DONE`인데 주문이 없는 결제를 `errorColl`에 기록하고 자동 취소하는 것. 웹훅이 어렵다면 하루 한 번 크론으로 대사한다.
- 예외: 없음
- 이유: Toss 승인(`DONE`) 직후 함수가 죽으면(타임아웃, 배포 교체) 트랜잭션도 결제 취소도 실행되지 않는다. 그러면 돈은 빠져나갔는데 주문이 없는 상태가 되고, 지금은 이걸 찾아낼 방법이 없다.
- 코드: 미구현. 위험 구간 `src/app/api/postPaymentsConfirm/route.ts:56`(승인) ~ `:73`(트랜잭션 시작)
- 변경 이력: 2026-11-09 신설

## Toss 요청 멱등성 키
- 상태: 제안
- 정책: Toss confirm/cancel 요청에 `Idempotency-Key` 헤더를 붙인다. 키는 confirm이면 `orderId`, cancel이면 `orderId` + 취소 사유 구분값으로 만든다.
- 이유: 네트워크 오류로 재시도하면 같은 요청이 두 번 처리될 수 있다.
- 코드: `src/features/purchase/lib/toss.ts:19`, `:29`
- 변경 이력: 2026-11-09 신설

## Toss 요청 타임아웃
- 상태: 미정
- 정책: Toss `fetch`에 타임아웃(`AbortSignal.timeout`)을 건다. 값은 미정, 추천값 10초.
- 결정할 것: confirm이 타임아웃 나면 승인 여부를 알 수 없다. 이때 취소를 시도할지, 대사에 맡길지([결제 대사](#결제-대사-toss--주문-맞춰-보기))
- 이유: 지금은 Toss가 응답하지 않으면 함수 실행 시간 한도(300초)까지 기다린다.
- 코드: `src/features/purchase/lib/toss.ts:19`, `:29`, `:39`
- 변경 이력: 2026-11-09 신설

## 주문에 결제 식별자 저장
- 상태: 제안
- 정책: 주문 문서에 `paymentKey`를 저장한다. 환불은 저장된 `paymentKey`로 바로 취소하고, `paymentKey`가 없는 옛 주문만 orderId 조회로 처리한다.
- 이유: 지금은 환불할 때마다 orderId로 Toss를 한 번 더 조회한다. 대사·고객 문의 때도 주문과 결제를 바로 연결할 수 없다.
- 코드: `src/features/purchase/lib/addOrder.ts:26`, `src/features/purchase/lib/toss.ts:38`
- 변경 이력: 2026-11-09 신설
