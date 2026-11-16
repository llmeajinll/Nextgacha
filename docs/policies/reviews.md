# 리뷰/QnA 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 리뷰 수정·삭제와 숨김
- 상태: 확정
- 정책:
  - 리뷰는 배송 완료된 주문당 한 번 쓴다.
  - 작성자는 작성 후 **5일**(달력일) 안에만 별점과 내용을 수정할 수 있다.
  - 작성자는 언제든 삭제할 수 있다. 삭제한 뒤 다시 쓸 수는 없다(`order.review` 플래그를 되돌리지 않는다).
  - 관리자는 욕설·비방, 광고, 개인정보 포함, 상품과 무관한 리뷰를 숨길 수 있다. 숨김은 삭제가 아니라 표시만 막는다.
- 코드: 수정 `src/app/api/protected/updateReview/route.ts`(본인·기한을 `arrayFilters`로 다시 확인) + `src/features/review-write/ui/EditReviewBtn.tsx`, 기한 값 `src/shared/lib/businessDays.ts` `REVIEW_EDIT_DAYS`, 수정 가능 여부 `src/app/api/getReview/route.ts:80` `canEdit`. 삭제 `src/app/api/protected/deleteReview/route.ts`(상품 상세 리뷰 탭의 본인 리뷰), 숨김 `src/app/api/postReviewHide/route.ts` + 관리자 리뷰 화면 `ReviewBoard` `HideControl`, 공개 조회 `getReview`가 숨긴 리뷰를 뺀다. 수정·삭제는 그 상품의 리뷰만 바꾼다(여러 상품을 한 주문으로 산 경우 상품마다 따로)
- 변경 이력: 2026-11-09 신설, 2026-11-11 확정 (기간 내 수정, 삭제 가능·재작성 불가, 관리자 숨김 4가지 사유), 2026-11-16 수정 기한 5일 확정·구현
