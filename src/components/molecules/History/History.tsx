'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { LabelTitle } from '@/components/molecules';
import dayjs from 'dayjs';
import { comma } from '@/shared/comma';
import {
  reviewBtn,
  bigLabelTitle,
  labelTitle,
  bigLabelContent,
  labelContent,
  labelContentKor,
  listContainer,
  title,
  contentContainer,
  content,
  count,
} from './history.css';
import Link from 'next/link';

export default function History({ props }: { props: any }) {
  console.log('props:', props);

  const route = useRouter();

  const topRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [topHeight, setTopHeight] = useState(150);
  const [middleHeight, setMiddleHeight] = useState(150);
  const [bottomHeight, setBottomHeight] = useState(150);

  const onClickReviewBtn = () => {
    sessionStorage.setItem('productInfo', JSON.stringify(props));
    route.push(`/mypage/history/review/${props.orderId}`);
  };

  useEffect(() => {
    if (middleRef.current) {
      const middleHeight = middleRef.current.offsetHeight;
      setMiddleHeight(middleHeight + 10);
    }
    if (topRef.current) {
      const topHeight = topRef.current.offsetHeight;
      setTopHeight(topHeight + 20);
    }
    if (bottomRef.current) {
      const bottomHeight = bottomRef.current.offsetHeight;
      setBottomHeight(bottomHeight + 20);
    }
  }, [props.list, props.address, props.status]);

  const ReceiptLabel = ({
    title,
    content,
    size = 'medium',
  }: {
    title: string;
    content: string;
    size?: 'medium' | 'big';
  }) => {
    const STATUS_TEXT: Record<string, string> = {
      '상품 확인중': 'checking product',
      배송중: 'sending',
      '배송 완료': 'finish',
      환불: 'refund',
    };
    const displayContent =
      title === 'status'
        ? STATUS_TEXT[content.trim()]
        : title === 'delivery'
        ? 'processing'
        : content;

    console.log(STATUS_TEXT['상품 확인중'], content === '상품 확인중');

    return (
      <Range preset='between'>
        <Range className={size === 'big' ? bigLabelTitle : labelTitle}>
          {title}
        </Range>
        <Range
          className={
            title === 'address'
              ? labelContentKor
              : size === 'big'
              ? bigLabelContent
              : labelContent
          }
        >
          {displayContent || 'processing'}
        </Range>
      </Range>
    );
  };

  return (
    <Range style={{ position: 'relative', width: '310px' }} preset='column'>
      {props.review === true && (
        <img
          src='/images/stamp.png'
          width={290}
          height={290}
          style={{
            position: 'absolute',
            top: '20px',
            left: '10px',
            opacity: '0.4',
          }}
        />
      )}
      <img src='/images/receipt_top.png' width={310} height={61} />
      <div style={{ position: 'relative', width: '310px', height: topHeight }}>
        <div
          ref={topRef}
          style={{
            position: 'absolute',
            width: '100%',
            boxSizing: 'border-box',
            padding: '20px 12px 0 12px',
          }}
        >
          <ReceiptLabel title='orderId' content={props.orderId} />
          <ReceiptLabel title='date' content={props.created_at} />
          <ReceiptLabel title='status' content={props.status} />
          <ReceiptLabel
            title='delivery'
            content={props.courier + ' ' + props.invoice}
          />
          <ReceiptLabel title='address' content={props.address} />
        </div>

        <img src='/images/receipt_middle.png' width={310} height={topHeight} />
      </div>
      <img src='/images/receipt_line.png' width={310} height={12} />
      <div
        style={{
          position: 'relative',
          width: '310px',
          height: middleHeight,
        }}
      >
        <div
          ref={middleRef}
          style={{
            position: 'absolute',
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 15px 0 12px',
          }}
        >
          <Range className={labelTitle}>list</Range>
          {props.list.map((value: any, index: number) => {
            return (
              <div key={props.orderId + index} className={listContainer}>
                <div className={title}>{value?.title || 'error'}</div>
                {value.product.map((val: any) => (
                  <Range
                    key={props.orderId + val.name + value.num}
                    className={contentContainer}
                    width='full'
                  >
                    <Range preset='between' width='full'>
                      <div className={content}>{val.name}</div>
                      <div className={count}>{val.count}개</div>
                    </Range>
                  </Range>
                ))}
              </div>
            );
          })}
        </div>

        <img
          src='/images/receipt_middle.png'
          width={310}
          height={middleHeight}
        />
      </div>
      <img src='/images/receipt_line.png' width={310} height={12} />
      <div
        style={{
          position: 'relative',
          width: '310px',
          height: bottomHeight,
        }}
      >
        <div
          ref={bottomRef}
          style={{
            position: 'absolute',
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px 0 12px',
          }}
        >
          <ReceiptLabel title='reward' content={comma(props.addPoint) + ' p'} />
          <ReceiptLabel
            title='price'
            content={comma(props.totalPrice) + ' won'}
            size='big'
          />

          {props.status === '배송 완료' && props.review === false && (
            <button className={reviewBtn} onClick={onClickReviewBtn}>
              GIVE A REVIEW
            </button>
          )}
        </div>

        <img
          src='/images/receipt_middle.png'
          width={310}
          height={bottomHeight}
        />
      </div>
      <img src='/images/receipt_bottom.png' width={310} height={14} />
    </Range>
  );
}
