import { toKoreaTime } from './koreaTime.ts';

// 기한 정책 값 (docs/policies/operations.md, reviews.md)
export const ORDER_CONFIRM_DAYS = 3; // 상품 확인중 → 배송 처리 기한 (영업일). 넘기면 자동 환불
export const QNA_ANSWER_DAYS = 2; // 문의 답변 기한 (영업일)
export const REVIEW_EDIT_DAYS = 5; // 리뷰 수정 가능 기간 (달력일)

const FORMAT = 'YYYY-MM-DD HH:mm:ss';

// now에서 영업일 n일 전 시각을 koreaTime()과 같은 KST 문자열로. created_at(문자열)이 이 값보다 작으면 기한 초과.
// ponytail: 토·일만 쉬는 날로 본다. 공휴일까지 빼려면 공휴일 목록(또는 API)을 받아 같은 루프에서 건너뛰기
export function businessDaysBefore(n: number, now: Date = new Date()): string {
  let d = toKoreaTime(now);
  for (let left = n; left > 0; ) {
    d = d.subtract(1, 'day');
    if (d.day() !== 0 && d.day() !== 6) left--;
  }
  return d.format(FORMAT);
}

// 달력일 n일 전 (리뷰 수정 기한)
export const daysBefore = (n: number, now: Date = new Date()) => toKoreaTime(now).subtract(n, 'day').format(FORMAT);
