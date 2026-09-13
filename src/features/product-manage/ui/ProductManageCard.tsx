'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Range } from '@/shared/ui';
import { CardProps } from '@/entities/product/model/types';
import {
  cardContainer,
  itemGrid,
  itemRow,
  nameInput,
  countInput,
  priceInput,
  totalCount,
  summaryRow,
  priceDisplay,
  editBtn,
  cancelBtn,
} from './productManageCard.css';

export default function ProductManageCard(props: CardProps) {
  const [productPrice, setProductPrice] = useState(props.price);
  const [productList, setProductList] = useState(props.list);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div key={props._id} className={cardContainer}>
      <h3>
        {props.num}. {props.title} {props.reserve ? '[예약 상품]' : ''}
      </h3>
      <Image
        src={`${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${props.num}.png`}
        alt={props.title}
        width={200}
        height={200}
      />
      {isEditMode ? (
        // 수정 모드 카드
        <Range preset='between' gap='10' className={itemGrid}>
          {productList.map((val, idx) => (
            <Range key={idx}>
              <Range gap='4' className={itemRow}>
                <input
                  value={val.name}
                  onChange={(e) => {
                    console.log(productList);
                    setProductList((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, name: e.target.value } : item,
                      ),
                    );
                  }}
                  className={nameInput}
                />
                :
                <input
                  value={val.count}
                  className={countInput}
                  onChange={(e) =>
                    setProductList((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? { ...item, count: Number(e.target.value) }
                          : item,
                      ),
                    )
                  }
                />
                개
              </Range>
            </Range>
          ))}
        </Range>
      ) : (
        // 원래 보이는 카드
        <Range preset='between' gap='4' className={itemGrid}>
          {props.list.map((val, idx) => (
            <div key={idx}>
              <div>
                {val.name} : {val.count} 개
              </div>
            </div>
          ))}
        </Range>
      )}

      <div className={totalCount}>총 {productList.length} 종</div>
      <Range preset='between' width='full' className={summaryRow}>
        <div>
          {isEditMode ? (
            <div>
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className={priceInput}
              />
              <span> 원</span>
            </div>
          ) : (
            <div className={priceDisplay}>
              {productPrice}원{' '}
              {props.isDiscount ? `[${props.discount}% 할인 중]` : ''}
            </div>
          )}
        </div>
        <Range gap='4'>
          <button
            onClick={async () => {
              setIsEditMode(!isEditMode);
              console.log({ price: productPrice, list: productList });
              if (isEditMode === true) {
                await fetch('/api/postEditProduct', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    num: props.num,
                    price: productPrice,
                    list: productList,
                  }),
                })
                  .then(async (res) => {
                    const data = await res.json();
                    console.log(data);
                    if (data.ok === true) {
                      alert('상품 수정이 완료되었습니다.');
                    }
                  })
                  .catch((err) => {
                    console.log('fetch postEditProduct error:', err);
                    return null;
                  });
              }
            }}
            className={editBtn}
          >
            {isEditMode ? '완료' : '수정'}
          </button>
          {isEditMode && (
            <button
              onClick={() => {
                setIsEditMode(false);
                setProductList(props.list);
                setProductPrice(props.price);
              }}
              className={cancelBtn}
            >
              취소
            </button>
          )}
        </Range>
      </Range>
    </div>
  );
}
