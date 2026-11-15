// 관리자가 리뷰를 숨길 수 있는 사유 (docs/policies/reviews.md). 라우트 검증과 관리자 화면이 같이 쓴다
export const HIDE_REASONS = ['욕설·비방', '광고', '개인정보 포함', '상품과 무관'] as const;
export type HideReason = (typeof HIDE_REASONS)[number];
