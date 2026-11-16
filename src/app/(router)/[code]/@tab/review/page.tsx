'use client';

import useSplitRoute from '@/shared/hooks/useSplitRoute';
import React, { useState, useEffect } from 'react';
import { ReviewProps } from '@/entities/review/model/types';
import { Range } from '@/shared/ui';
import getReview from '@/entities/review/api/getReview';
import { Review } from '@/entities/review/ui';
import DeleteReviewBtn from '@/features/review-write/ui/DeleteReviewBtn';
import EditReviewBtn from '@/features/review-write/ui/EditReviewBtn';
import { emptyState, listWrap, grid, moreBtn } from './page.css';

export default function ReviewTab() {
  const [review, setReview] = useState<ReviewProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { firstRoute } = useSplitRoute();

  async function fetchReview(page: number) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/getReview?num=${firstRoute}&page=${page}`);
      const { result, hasMore } = await res.json();
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
        <Range width='full' className={emptyState}>
          등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!
        </Range>
      ) : (
        <div className={listWrap}>
          <div className={grid}>
            <>
              {review &&
                review.map((val: ReviewProps, idx: number) => (
                  <Review
                    props={val}
                    key={`${val.orderId}-${idx}-${val.rate}`}
                    action={
                      val.isMine && (
                        <>
                          {val.canEdit && (
                            <EditReviewBtn
                              num={Number(firstRoute)}
                              orderId={val.orderId}
                              rate={val.rate}
                              content={val.content}
                              onSaved={(next) =>
                                setReview((prev) => prev.map((r) => (r.orderId === val.orderId ? { ...r, ...next } : r)))
                              }
                            />
                          )}
                        <DeleteReviewBtn
                          num={Number(firstRoute)}
                          orderId={val.orderId}
                          onDeleted={() => setReview((prev) => prev.filter((r) => r.orderId !== val.orderId))}
                        />
                        </>
                      )
                    }
                  />
                ))}
            </>

            {/* {hasMore && ( */}
          </div>
          {hasMore && (
            <button onClick={handleMore} disabled={isLoading} className={moreBtn}>
              {isLoading ? 'LOADING ...' : 'MORE'}
            </button>
          )}
        </div>
      )}
    </>
  );
}
