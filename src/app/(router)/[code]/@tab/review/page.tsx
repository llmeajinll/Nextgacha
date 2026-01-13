'use client';

import useSplitRoute from '@/app/hooks/useSplitRoute';
import React, { useState, useEffect } from 'react';
import { ReviewProps } from '@/shared/type';
import { Range } from '@/components/atoms';
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
      {review.length === 0 ? (
        <Range
          width='full'
          style={{
            boxSizing: 'border-box',
            border: '1px solid lightgray',
            padding: '50px',
            fontSize: '20px',
          }}
        >
          등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!
        </Range>
      ) : (
        <div style={{ width: '100%' }}>
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
            <>
              {review &&
                review.map((val: ReviewProps, idx: number) => (
                  <Review props={val} key={val.orderId + idx} />
                ))}
            </>

            {/* {hasMore && ( */}
          </div>
          {true && (
            <button
              onClick={handleMore}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '30px',
                backgroundColor: 'white',
                color: 'gray',
              }}
            >
              {isLoading ? 'LOADING ...' : 'MORE'}
            </button>
          )}
        </div>
      )}
    </>
  );
}
