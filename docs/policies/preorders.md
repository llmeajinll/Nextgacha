# 예약 판매 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 예약 상품 판매 기간
- 상태: 확정
- 정책:
  - 예약 마감일(`reserve`)이 지나면 결제를 막는다. 결제 승인(`verifyOrder`)에서도 같은 기준(KST)으로 다시 확인한다.
  - 마감 후에는 상품을 목록·검색·상세에서 숨기고, 마감 2주 뒤 일반 상품으로 전환해 다시 보여준다.
  - 상품 상세에 `MM월 dd일 출고 시작`을 표시한다.
  - 예약 상품 취소는 일반 상품과 같다(`상품 확인중`일 때만, [구매자 주문 취소](./refunds.md#구매자-주문-취소)).
- 구현 메모: 숨김·전환은 크론 없이 조회할 때 날짜로 판정할 수 있다 (`now < reserve` 예약 판매, `reserve ≤ now < reserve + 14일` 숨김, 그 뒤 일반 판매).
- 메모: 상품에는 이미 `reserveStart`·`reserveEnd`(예약 기간)와 `reserve`(배송일)가 따로 있어서 마감은 `reserveEnd`로 판정한다. 예약 시작 전(`reserveStart` 이전)도 결제를 막는다.
- 이유: 지금은 `reserve` 날짜를 저장만 하고 결제할 때 확인하지 않는다.
- 코드: 판정 `src/entities/product/lib/salePolicy.ts` `saleState`(마감 기준은 `reserveEnd` 당일 끝), 결제 차단 `src/features/purchase/lib/verifyOrder.ts:51`, 목록 숨김 `findProducts`, 상세 숨김 `src/app/(router)/[code]/layout.tsx`. 출고일은 기존 `reserve`(배송일)를 상세에 표시
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (마감 후 결제 차단, 2주 숨김 후 일반 상품 전환), 2026-11-15 구현
