import React, { useEffect } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { LabelTitle } from '@/components/molecules';
import dayjs from 'dayjs';
import { comma } from '@/shared/comma';
import { imageStyle, Title, contentStyle } from './history.css';

export default function History({ props }: { props: any }) {
  console.log('props:', props);

  const ListContent = ({ val }: { val: { name: string; count: number } }) => {
    return (
      <Range gap='10' width='340' className={contentStyle}>
        <div>
          {val.name}: {val.count}개
        </div>
      </Range>
    );
  };

  return (
    <Range gap='15' style={{ width: '620px' }} preset='left'>
      <Image
        alt='img'
        src={
          props.product.image[0]
            ? String(props.product.image[0])
            : '/images/defaultImg.png'
        }
        width={200}
        height={200}
        className={imageStyle}
      />
      <Range preset='columnBetween' gap='8' style={{ padding: '3px 0 0 0' }}>
        <div className={Title}>{props.product.title}</div>
        <LabelTitle
          label='주문일'
          content={dayjs(props.created_at).format('YYYY년 MM월 DD일')}
        />
        <LabelTitle
          label='운송장'
          content={
            props.courier && props.invoice
              ? props.courier + ' ' + props.invoice
              : '준비중'
          }
        />
        <LabelTitle label='상태' content={props.status} />
        <LabelTitle label='가격' content={`${comma(props.totalPrice)}원`} />
        <LabelTitle
          label='내역'
          content={
            <Range
              gap='4 10'
              width='340'
              preset='left'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {props.list.map((v: any, i: number) => (
                <div key={i} className={contentStyle}>
                  {v.name} : {v.count}개
                </div>
              ))}
            </Range>
          }
        />
      </Range>
    </Range>
  );
}
