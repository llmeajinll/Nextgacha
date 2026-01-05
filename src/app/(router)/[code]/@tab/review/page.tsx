'use client';

import useSplitRoute from '@/app/hooks/useSplitRoute';
import React, { useState, useEffect } from 'react';
import { ReviewProps } from '@/shared/type';
import getReview from '@/api/getReview';
import { Review } from '@/components/molecules';

export default function ReviewTab() {
  const [review, setReview] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { firstRoute } = useSplitRoute();

  async function fetchReview(page: number) {
    console.log('page : ', page);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/getReview?num=${firstRoute}&page=${page}`);
      const { result, hasMore } = await res.json();
      console.log(result);
      setReview((prev) => [...prev, ...result]);
      setHasMore(hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    fetchReview(0);
  }, []);

  if (!mounted) {
    return <button disabled>더보기</button>;
  }

  const handleMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReview(nextPage);
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 460px)',
          justifyContent: 'space-between',
          margin: '0 auto',
          width: '100%',
          rowGap: '20px',
        }}
      >
        {review.length === 0 ? (
          <div>리뷰가 없습니다! 첫 리뷰를 남겨주세요!</div>
        ) : (
          <>
            {review &&
              review.map((val: ReviewProps, idx: number) => (
                <Review props={val} key={val.orderId + idx} />
              ))}
          </>
        )}
        {hasMore && (
          <button onClick={handleMore} disabled={isLoading}>
            {isLoading ? '로딩 중...' : '더보기'}
          </button>
        )}
      </div>
    </>
  );
}
