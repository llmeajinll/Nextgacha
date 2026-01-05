import { ReviewProps } from '@/shared/type';
import React from 'react';
import { Range, Writer } from '@/components/atoms';
import StarRating from '../StarRating/StarRating';
import dayjs from 'dayjs';

export default function Review({ props }: { props: ReviewProps }) {
  const changeStar = (name: string) => {
    if (!name) return '';

    const [id] = name.split('@');

    if (id.length <= 3) {
      return '*'.repeat(id.length);
    }

    const visible = id.slice(0, 3);
    const masked = '*'.repeat(id.length - 3);
    return visible + masked;
  };

  return (
    <Range preset='column' key={props.orderId} style={{ width: '460px' }}>
      <StarRating value={props.rate} disabled={true} />

      <Range gap='8' style={{ marginBottom: '10px' }}>
        {props.list.map((v) => (
          <div
            key={v.name + v.count}
            style={{ color: 'gray', fontSize: '14px' }}
          >
            {v.name} : {v.count}개
          </div>
        ))}
      </Range>

      <div style={{ fontSize: '18px' }}>{props.content}</div>
      <Writer writer={props.user} created_at={props.created_at} />
    </Range>
  );
}
