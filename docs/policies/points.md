# 포인트 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 포인트 유효기간
- 상태: 미정
- 정책: 미정. 지금은 만료가 없다.
- 결정할 것: 만료 여부와 기간 (예: 적립일부터 1년). 만료를 두면 적립 건별로 기록해야 해서 `user.point` 숫자 하나로는 부족하다.
- 코드: 적립 `src/features/purchase/lib/orderPolicy.ts:58` (소계의 1%), 지급 `src/app/api/postSendingToFinish/route.ts:29`
- 변경 이력: 2026-11-09 신설

## 반품 시 적립 포인트 회수
- 상태: 미정
- 정책: [배송 후 반품/교환](./refunds.md) 정책을 정할 때 같이 결정한다.
- 변경 이력: 2026-11-09 신설
