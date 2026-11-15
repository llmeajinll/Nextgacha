'use client';

/* eslint-disable @next/next/no-img-element -- 영수증 일러스트: 내용 높이에 맞춰 늘리는 장식 이미지라 next/image 최적화 대상이 아님 (docs/policies/design.md 아이콘 예외) */

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Range } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import type { OrderView } from '../model/types';
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
  receiptWrap,
  stampImg,
  sectionOuter,
  sectionHeightVar,
  innerPadTop,
  innerPadMiddle,
  innerPadBottom,
} from './history.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import Link from 'next/link';

const STATUS_TEXT: Record<string, string> = {
  '상품 확인중': 'checking product',
  배송중: 'sending',
  '배송 완료': 'finish',
  환불: 'refund',
};

function ReceiptLabel({
  title,
  content,
  size = 'medium',
}: {
  title: string;
  content: string;
  size?: 'medium' | 'big';
}) {
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
        {title === 'status'
          ? STATUS_TEXT[content.trim()]
          : content || 'processing'}
      </Range>
    </Range>
  );
}

// action: 주문 상태에 따른 버튼 자리 (예: 구매자 취소). entity가 feature를 import하지 않도록 바깥에서 넣는다
export default function History({ props, action }: { props: OrderView; action?: ReactNode }) {

  const route = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const topRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [topHeight, setTopHeight] = useState(150);
  const [middleHeight, setMiddleHeight] = useState(150);
  const [bottomHeight, setBottomHeight] = useState(150);

  const onClickReviewBtn = () => {
    sessionStorage.setItem('productInfo', JSON.stringify(props));
    route.push(`${pathname}/review/${props.orderId}?page=${page}`);
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

  return (
    <Range className={receiptWrap} preset='column'>
      {props.review === true && (
        <img
          alt=''
          src='/images/stamp.png'
          width={290}
          height={290}
          className={stampImg}
        />
      )}
      <img alt='' src='/images/receipt_top.png' width={310} height={61} />
      <div
        className={sectionOuter}
        style={assignInlineVars({ [sectionHeightVar]: `${topHeight}px` })}
      >
        <div ref={topRef} className={innerPadTop}>
          <ReceiptLabel title='orderId' content={props.orderId} />
          <ReceiptLabel title='date' content={props.created_at} />
          <ReceiptLabel title='status' content={props.status} />
          <ReceiptLabel
            title='delivery'
            content={props.courier + ' ' + props.invoice}
          />
          <ReceiptLabel title='address' content={props.address} />
        </div>

        <img alt='' src='/images/receipt_middle.png' width={310} height={topHeight} />
      </div>
      <img alt='' src='/images/receipt_line.png' width={310} height={12} />
      <div
        className={sectionOuter}
        style={assignInlineVars({ [sectionHeightVar]: `${middleHeight}px` })}
      >
        <div ref={middleRef} className={innerPadMiddle}>
          <Range className={labelTitle}>list</Range>
          {props.list.map((value, index) => {
            return (
              <div key={props.orderId + index} className={listContainer}>
                <div className={title}>{value?.title || 'error'}</div>
                {value?.product.map((val) => (
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
          alt=''
          src='/images/receipt_middle.png'
          width={310}
          height={middleHeight}
        />
      </div>
      <img alt='' src='/images/receipt_line.png' width={310} height={12} />
      <div
        className={sectionOuter}
        style={assignInlineVars({ [sectionHeightVar]: `${bottomHeight}px` })}
      >
        <div ref={bottomRef} className={innerPadBottom}>
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
          {action}
        </div>

        <img
          alt=''
          src='/images/receipt_middle.png'
          width={310}
          height={bottomHeight}
        />
      </div>
      <img alt='' src='/images/receipt_bottom.png' width={310} height={14} />
    </Range>
  );
}
