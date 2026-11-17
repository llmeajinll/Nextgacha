import { ReviewProps } from '../model/types';
import React from 'react';
import { Range, Writer } from '@/shared/ui';
import { StarRating } from '@/shared/ui';
import dayjs from 'dayjs';
import { container, itemLabel, content } from './review.css';

// action: 본인 리뷰 삭제 버튼 같은 동작 자리 (entity가 feature를 import하지 않도록 바깥에서 넣는다)
export default function Review({ props, action }: { props: ReviewProps; action?: React.ReactNode }) {
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
      {action}
    </Range>
  );
}
