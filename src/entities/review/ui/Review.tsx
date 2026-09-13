import { ReviewProps } from '@/entities/review/model/types';
import React from 'react';
import { Range, Writer } from '@/shared/ui';
import { StarRating } from '@/shared/ui';
import dayjs from 'dayjs';
import { container, itemLabel, content } from './review.css';

export default function Review({ props }: { props: ReviewProps }) {
  return (
    <Range preset='column' key={props.orderId} className={container}>
      <StarRating value={props.rate} disabled={true} />

      <Range gap='8'>
        {props.list.map((v) => (
          <div key={v.name + v.count} className={itemLabel}>
            {v.name} : {v.count}개
          </div>
        ))}
      </Range>

      <div className={content}>{props.content}</div>
      <Writer writer={props.user} created_at={props.created_at} />
    </Range>
  );
}
