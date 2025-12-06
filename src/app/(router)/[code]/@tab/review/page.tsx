'use client';

import useSplitRoute from '@/app/hooks/useSplitRoute';
import React, { useState, useEffect } from 'react';
import { ReviewProps } from '@/shared/type';
import getReview from '@/api/getReview';
import { Review } from '@/components/molecules';

export default function ReviewTab() {
  const [review, setReview] = useState([]);
  const { firstRoute } = useSplitRoute();

  useEffect(() => {
    async function fetchReview() {
      const review = await getReview(firstRoute)
        .then((res) => {
          console.log('review:', res);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });

      setReview(review.result);
    }

    fetchReview();
  }, []);

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
        {review &&
          review.map((val: ReviewProps) => (
            <Review props={val} key={val._id} />
          ))}
        {review &&
          review.map((val: ReviewProps) => (
            <Review props={val} key={val._id} />
          ))}

        {review &&
          review.map((val: ReviewProps) => (
            <Review props={val} key={val._id} />
          ))}
      </div>
    </>
  );
}
