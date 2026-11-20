import type { ReviewProps } from '../model/types';

// 상품 상세 리뷰 한 페이지(더보기). 실패하면 throw — 부르는 쪽이 로딩 상태를 정리한다
export default async function getReview(num: string, page: number): Promise<{ result: ReviewProps[]; hasMore: boolean }> {
  const res = await fetch(`/api/getReview?num=${num}&page=${page}`);
  const { result, hasMore } = await res.json();
  return { result, hasMore };
}
