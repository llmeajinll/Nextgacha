'use client';

import React, { useState } from 'react';
import { Range } from '@/components/atoms';
import { CardProps } from '@/shared/type';

export default function ProductManageCard(props: CardProps) {
  const [productPrice, setProductPrice] = useState(props.price);
  const [productList, setProductList] = useState(props.list);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div key={props._id} style={{ width: '640px' }} >
      <h3>
        {props.num}. {props.title} {props.reserve ? '[예약 상품]' : ''}
      </h3>
      {isEditMode ? (
        <Range
          preset='between'
          gap='10'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 300px)',
          }}
        >
          {productList.map((val, idx) => (
            <Range key={idx}>
              <Range gap='4' style={{ width: '300px', alignItems: 'center' }}>
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
                  style={{
                    width: '200px',
                    border: '1px solid lightgray',
                    padding: '5px 4px 4px 4px',
                    fontSize: '18px',
                    color: '#4c4c4c',
                  }}
                />
                :
                <input
                  value={val.count}
                  style={{
                    width: '50px',
                    border: '1px solid lightgray',
                    padding: '5px 4px 4px 4px',
                    fontSize: '18px',
                    color: '#4c4c4c',
                  }}
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
        <Range
          preset='between'
          gap='4'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 300px)',
          }}
        >
          {props.list.map((val, idx) => (
            <div key={idx}>
              <div>
                {val.name} : {val.count} 개
              </div>
            </div>
          ))}
        </Range>
      )}

      <div style={{ marginTop: '20px', fontSize: '20px' }}>
        총 {productList.length} 종
      </div>
      <Range preset='between' width='full' style={{ marginTop: '20px' }}>
        <div>
          {isEditMode ? (
            <div>
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                style={{
                  width: '90px',
                  border: '1px solid lightgray',
                  padding: '5px 4px 4px 4px',
                  fontSize: '18px',
                  color: '#4c4c4c',
                }}
              />
              <span> 원</span>
            </div>
          ) : (
            <div style={{ fontSize: '20px' }}>
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
            style={{
              border: 'none',
              backgroundColor: '#75C3FE',
              color: 'white',
              fontSize: '18px',
              padding: '8px 16px',
              lineHeight: '22px',
              cursor: 'pointer',
            }}
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
              style={{
                border: 'none',
                backgroundColor: 'lightgray',
                color: 'white',
                fontSize: '18px',
                padding: '8px 16px',
                lineHeight: '22px',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
          )}
        </Range>
      </Range>
    </div>
  );
}
