import { ReviewProps } from '@/shared/type';
import React from 'react';
import { Range } from '@/components/atoms';
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
    <Range preset='column' key={props._id} style={{ width: '460px' }}>
      <StarRating value={props.rate} disabled={true} />

      <Range gap='5' style={{ marginBottom: '10px' }}>
        {props.buy.map((v) => (
          <div key={v.code} style={{ color: 'gray', fontSize: '14px' }}>
            {v.name} | {v.count}개
          </div>
        ))}
      </Range>

      <div style={{ fontSize: '18px' }}>{props.title}</div>
      <div
        style={{
          marginLeft: 'auto',
          fontSize: '12px',
          lineHeight: '25px',
          color: 'gray',
          fontFamily: 'silkscreen',
        }}
      >
        written by {changeStar(props.user)} at{' '}
        {dayjs(props.created_at).format('YYYY-MM-DD')}
      </div>
    </Range>
  );
}
