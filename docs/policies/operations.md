# 운영 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고. 관리자 화면·권한의 기술 규칙은 [관리자 정책](./admin.md).

## 주문 확인 기한
- 상태: 확정
- 정책: `상품 확인중` 주문은 결제 후 **3영업일**(토·일 제외, 공휴일은 아직 세지 않음) 안에 `배송중`(송장 입력) 또는 `환불`로 처리한다. 기한을 넘긴 주문은 매일 09:00(KST) 자동 환불하고, 구매자에게 사이트 안 알림을 남긴다.
  - 처리 전에 실제 재고가 모자라면(DB 재고와 실물이 다를 때) 구매자에게 안내하고 환불한다. DB 재고는 결제 때 이미 빠지므로, 결제 뒤 DB상 품절이 되는 경우는 없다.
  - 관리자 홈에 기한을 넘긴 주문 수("배송 기한 초과")를 보여준다. 다음 자동 환불 대상이다.
  - 자동 환불은 한 번에 20건까지 처리한다. 결제 취소가 실패한 주문은 그대로 남아 다음 날 다시 시도한다. 처리 건수는 관리자 카카오톡으로 받는다.
- 코드: 기한 값 `src/shared/lib/businessDays.ts` `ORDER_CONFIRM_DAYS`, 자동 환불 `src/app/api/cron/overdue-orders/route.ts`(인증 `Authorization: Bearer $CRON_SECRET`), 스케줄 `vercel.json` `crons`(`0 0 * * *` UTC), 환불 흐름 `src/features/purchase/lib/refundOrder.ts`(`by: 'system'`, 주문에 `canceledBy: 'system'`), 관리자 홈 `src/app/(router)/manager/page.tsx:16` `overdueOrders`
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (기한 초과 시 안내 + 자동 환불), 2026-11-16 기한 3영업일 확정·구현 (Vercel Cron, 사이트 안 알림)

## 품절·재입고
- 상태: 확정
- 정책: 재고가 0인 상품은 목록에서 숨긴다(예약 상품은 `[예약]`으로 계속 보인다). 품절 상품 상세에서 로그인한 사용자가 재입고 알림을 신청할 수 있다. 알림은 사이트 안 알림(헤더 종 아이콘)으로 보낸다.
  - 관리자가 재입고 예정 시각(정시 단위)을 정하면 신청자에게 "[상품]가 YYYY.MM.DD HH:00에 재입고 예정입니다."를 보낸다. 상품 상세에도 예정 시각이 보인다.
  - 품절이던 상품에 재고가 생기면(상품 관리 간편 수정) 신청자에게 "재입고되었습니다"를 보내고 신청 목록과 예정 시각을 비운다.
  - 신청자 이메일(`restockSubs`)은 조회 API로 내보내지 않는다. 상세는 "내가 신청했는지"만 알려준다.
- 코드: 품절 숨김 `src/entities/product/lib/findProducts.ts:57`. 신청 `src/app/api/protected/postRestockAlert/route.ts` + `src/features/purchase/ui/RestockAlert.tsx`, 예정 시각 `src/app/api/postRestock/route.ts`(관리자) + `src/features/product-manage/ui/RestockControl.tsx`, 재입고 알림 `src/app/api/postEditProduct/route.ts:30`, 알림 저장 `src/shared/api/notifyUser.ts`. 장바구니 정리 `src/app/api/getCart/route.ts`, `src/features/purchase/lib/validateStock.ts`
- 확인된 불일치 (미해결): 예약 상품은 화면에서 재고 0이어도 `[예약]`으로 보이고 관리자 수정 화면도 "예약 상품은 재고 0이어도 주문을 받는다"고 보지만(`src/features/product-manage/ui/ProductManageRow.tsx:199`), 결제 직전 `validateStock`(`src/features/purchase/lib/validateStock.ts:41`)과 결제 승인 `reduceStock`은 예약 상품도 재고가 모자라면 거절한다. 즉 재고 0 예약 상품은 실제로는 살 수 없다. 예약 상품에 재고를 미리 넣을지, 재고 검사를 예약 상품만 건너뛸지(그러면 예약 한도를 따로 둬야 함) 정해야 한다. 동작은 아직 바꾸지 않았다.
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (품절 숨김, 재입고 알림), 2026-11-16 재입고 알림 구현 (사이트 안 알림, 재입고 예정 시각), 예약 상품 재고 0 불일치 기록

## 배송 지연 안내
- 상태: 확정
- 정책: 예약 출고가 밀리거나 배송이 늦어지면 공지사항에 올리고, 해당 구매자에게 사이트 안 알림을 남긴다. 5일 이상 늦어지면 환불을 제안한다(`배송중` 전이면 [구매자 주문 취소](./refunds.md#구매자-주문-취소)와 같은 흐름). `상품 확인중`이 3영업일을 넘기면 [주문 확인 기한](#주문-확인-기한)에 따라 자동 환불되고 알림이 간다.
- 다시 볼 때: 구매자 카카오톡(알림톡)은 비즈니스 채널과 발송 대행사 계약이 필요해서 미룬다. 계약하면 `src/shared/api/notifyUser.ts`에서 사이트 알림과 같이 보낸다. 관리자 본인에게 보내는 "나에게 보내기"와는 다르다.
- 코드: 사이트 안 알림 `src/shared/api/notifyUser.ts`, `notificationColl`(`src/shared/api/mongodb.ts`), 조회·읽음 `src/app/api/protected/getNotifications/route.ts`, `postNotificationsRead/route.ts`, 종 아이콘 `src/features/notification/ui/NotificationBell.tsx`(Header, MobileNav). 지연 공지는 관리자 공지 화면에서 수동. 배송 지연을 골라 알리는 관리자 화면은 아직 없다(자동 환불 알림만 자동)
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (공지 + 카카오톡, 5일 이상 시 환불 제안), 2026-11-16 구매자 알림을 사이트 안 알림으로 변경 (알림톡은 대행사 계약 뒤)

## 문의(QnA) 답변
- 상태: 확정
- 정책: 답변 기한은 **2영업일**이다. 기한이 지난 미답변 문의(마지막 글이 관리자 답변이 아닌 문의, 추가 질문 포함)를 관리자 홈에 표시한다. 비밀 문의는 작성자와 관리자만 본다.
- 코드: 기한 값 `src/shared/lib/businessDays.ts` `QNA_ANSWER_DAYS`, 관리자 홈 `src/app/(router)/manager/page.tsx:23` `countOverdueQna`, 표시 `src/widgets/ManagerMenu/ManagerMenu.tsx`. 질문 `src/app/api/protected/postQna`, `postRequestQna`
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (미답변 문의 관리자 홈 표시), 2026-11-16 기한 2영업일 확정·구현

## 오류 제보 처리
- 상태: 확정
- 정책: `/manager/error`를 주 1회 이상 확인한다. 결제 관련 기록(`[결제 취소 실패]`, `[환불 DB 처리 실패]`)은 [장애 대응](./incident.md#결제-불일치-처리)으로 바로 처리한다. 제보에 처리 상태(`접수` / `처리 완료` / `무시`)를 둔다.
- 이유: 지금은 상태가 없어 처리한 건과 안 한 건이 구분되지 않는다.
- 코드: `src/app/(router)/manager/error/page.tsx`, `src/features/error-manage/`, 상태 변경 `src/app/api/postErrorStatus/route.ts`. 옛 문서(`status` 없음)는 `접수`로 읽는다 (`normalizeError.ts`)
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (주 1회, 처리 상태 추가)

## 관리자 권한 등급
- 상태: 확정
- 정책: 혼자 운영하는 동안은 단일 등급을 유지한다. `ADMIN_EMAILS`에 있으면 모든 관리자 기능(가격·재고·할인·환불)을 쓸 수 있다.
- 다시 볼 때: 운영을 다른 사람과 나누게 되면 "주문 처리만"과 "상품·가격·환불까지"로 나눈다. [관리자 작업 기록](./admin.md#관리자-작업-기록)이 먼저 있어야 한다.
- 코드: `src/shared/lib/isAdmin.ts`, `src/proxy.ts` `ADMIN_API_PATHS`
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (단일 등급)

## 이벤트 운영
- 상태: 확정
- 정책:
  - 이벤트 시작 전에 할인율, 대상 상품, 재고를 확인한다.
  - 할인이 끝나는 시점은 [할인 기간](./discounts.md#할인-기간)의 종료일로 판정한다. 지금은 Atlas Trigger가 할인을 끄고 있는데, 종료일 판정이 구현되면 Trigger에서 할인 끄기 부분을 뺀다(이벤트 상태 초기화만 남김).
- 이유: Trigger로 끄는 방식은 (1) 운영 `gacha`에만 돌아서 `gacha_dev`에서는 할인이 안 꺼지고, (2) 실패해도 알림이 없어서 할인이 계속 적용될 수 있고, (3) 코드가 레포 밖이라 할인 로직을 바꿀 때 놓치기 쉽다. Trigger 스케줄의 시간대가 UTC인지 KST인지도 확인해야 한다(UTC 자정이면 한국 시간 오전 9시).
- 코드: `src/app/api/postEvent/route.ts`, Atlas Trigger(레포 밖, 사본 위치는 [레포 밖의 DB 로직](./data.md#레포-밖의-db-로직))
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (시작 전 3가지 확인, 할인 종료는 종료일 판정으로 이전)
