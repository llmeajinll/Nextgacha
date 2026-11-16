# 주문/결제 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 결제 시 배송지 검증
- 상태: 확정
- 정책: 결제 승인 전에 서버에서 `address`가 비어 있지 않은 문자열이고 200자 이하인지 확인한다. 실패하면 Toss 승인 전에 거절한다.
- 예외: 없음
- 이유: 지금은 요청 본문의 `address`를 그대로 주문에 저장해서, 배송지가 빈 주문이 생길 수 있다. 길이 기준은 `updateAddress`의 기존 검증과 맞춘다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:29` (검증 없음), 기준 `src/app/api/updateAddress/route.ts`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 결제 대사 (Toss ↔ 주문 맞춰 보기)
- 상태: 확정
- 정책: Toss 웹훅(결제 상태 변경)을 받는다. `DONE`인데 주문이 없는 결제는 `errorColl`에 기록하고 자동 취소한 뒤 [에러 알림](./engineering.md#에러-알림)을 보낸다.
- 구현 메모: 승인 직후에는 아직 트랜잭션이 진행 중일 수 있으므로, 웹훅을 받자마자 취소하지 말고 잠시(예: 1분) 뒤 다시 확인한다. 웹훅 요청은 Toss 결제 조회로 진위를 확인한다.
- 예외: 없음
- 이유: Toss 승인(`DONE`) 직후 함수가 죽으면(타임아웃, 배포 교체) 트랜잭션도 결제 취소도 실행되지 않는다. 그러면 돈은 빠져나갔는데 주문이 없는 상태가 되고, 지금은 이걸 찾아낼 방법이 없다.
- 코드: `src/app/api/webhooks/toss/route.ts` (Toss 개발자센터에 웹훅 URL 등록 필요). 승인 응답을 못 받은 경우는 `src/app/api/postPaymentsConfirm/route.ts` `cancelIfApproved`
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (Toss 웹훅), 2026-11-15 구현

## Toss 요청 멱등성 키
- 상태: 확정
- 정책: Toss confirm/cancel 요청에 `Idempotency-Key` 헤더를 붙인다. 키는 confirm이면 `orderId`, cancel이면 `orderId` + 취소 사유 구분값으로 만든다.
- 이유: 네트워크 오류로 재시도하면 같은 요청이 두 번 처리될 수 있다.
- 코드: `src/features/purchase/lib/toss.ts:38`(confirm), `:52`(cancel, 사유 구분값 `order-failed`·`refund`·`user-cancel`·`reconcile`)
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정, 2026-11-15 구현

## Toss 요청 타임아웃
- 상태: 확정
- 정책: Toss `fetch`에 `AbortSignal.timeout(10_000)`(10초)을 건다.
  - confirm이 타임아웃 나면 승인 여부를 알 수 없으므로, `orderId`로 결제를 조회해서 `DONE`이면 취소하고 `errorColl`에 기록한다. 조회도 실패하면 기록만 남기고 [결제 대사](#결제-대사-toss--주문-맞춰-보기)에 맡긴다.
  - 사용자에게는 "결제가 확인되지 않았습니다. 주문 내역을 확인해주세요"를 보여준다 (재결제 버튼을 바로 주지 않음, [로딩 표시 시점](./ux.md#로딩-표시-시점)).
- 이유: 지금은 Toss가 응답하지 않으면 함수 실행 시간 한도(300초)까지 기다린다.
- 코드: `src/features/purchase/lib/toss.ts:23`(모든 Toss 호출), 타임아웃 처리 `src/app/api/postPaymentsConfirm/route.ts:82` `cancelIfApproved`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정 (10초, 타임아웃 시 조회 후 취소), 2026-11-15 구현

## 주문에 결제 식별자 저장
- 상태: 확정
- 정책: 주문 문서에 `paymentKey`를 저장한다. 환불은 저장된 `paymentKey`로 바로 취소하고, `paymentKey`가 없는 옛 주문만 orderId 조회로 처리한다.
- 이유: 지금은 환불할 때마다 orderId로 Toss를 한 번 더 조회한다. 대사·고객 문의 때도 주문과 결제를 바로 연결할 수 없다.
- 코드: 저장 `src/features/purchase/lib/addOrder.ts:39`, 취소 `src/features/purchase/lib/toss.ts` `cancelOrderPayment`(없으면 orderId 조회). 조회 API(`getHistory`, `getOneHistory`)는 `paymentKey`를 내보내지 않는다
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정, 2026-11-15 구현

## 결제창 이탈 및 모달 종료 시 상태 정리
- 상태: 확정
- 정책: Toss 결제창이 열려 있는 상태에서 페이지를 벗어나거나 결제를 취소/종료할 때, `localStorage`의 대기 중인 주문 데이터(`pending_order_items`, `address`, `used_point`)를 즉시 파기하고 구매 버튼의 비활성화(disabled/loading) 상태를 초기화한다. 또한 결제 인증 중 사용자의 실수로 인한 창 닫기나 뒤로가기를 방지하도록 `beforeunload` 경고를 건다.
- 예외: 정상 결제 승인 리다이렉트(`/success`)로 넘어가는 순간에는 백엔드 `/api/postPaymentsConfirm` 호출을 위해 임시 데이터를 보존하고, 승인 성공 직후 삭제한다.
- 이유: 결제를 취소/이탈했는데 이전 주문 정보가 스토리지에 남아 있으면 다음 결제 시 오작동을 유발할 수 있고, 사용자의 실수로 결제가 중단되는 경험을 줄이기 위함이다.
- 코드: `src/features/purchase/ui/BuyBtn.tsx`
- 변경 이력: 2026-11-16 신설

