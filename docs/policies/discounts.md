# 할인/이벤트 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 할인율 범위
- 상태: 확정
- 정책: `discount`는 0 이상 100 미만 정수만 허용한다. 범위를 벗어나면 400.
- 이유: 지금은 검증이 없어서 100 이상을 넣으면 판매가가 0원이나 음수가 된다.
- 코드: `src/app/api/postEvent/route.ts:7`
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 할인 기간
- 상태: 확정
- 정책: 할인에 시작일·종료일을 둔다. 화면 표시와 결제 승인(`verifyOrder`) 모두 같은 기준(KST)으로 "지금 할인 중인지" 판정한다.
- 이유: 지금은 한 번 켜면 관리자나 Atlas Trigger가 끌 때까지 계속 적용된다. 날짜로 판정하면 끄는 작업이 늦거나 실패해도 할인이 남지 않는다.
- 구현 시 바뀌는 곳: `postEvent`(기간 저장), 가격 계산(`orderPolicy.ts`), Atlas Trigger의 할인 끄기 부분은 제거 ([이벤트 운영](./operations.md#이벤트-운영))
- 코드: 판정 `src/entities/product/lib/salePolicy.ts` `activeDiscount`(종료일 당일까지 포함), 저장 `src/app/api/postEvent/route.ts` (`discountStart`·`discountEnd`), 관리자 이벤트 화면 기간 입력. 조회(`findProducts`, `getOneProduct`, `getCart`, `getSimpleCart`)와 `verifyOrder`가 같은 함수를 쓴다. Atlas Trigger의 할인 끄기는 Atlas에서 직접 지워야 함
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (시작·종료일, KST), 2026-11-15 구현
