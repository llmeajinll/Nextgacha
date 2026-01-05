'use client';

import React, { useState, useEffect } from 'react';
import Order from '@/components/molecules/Order/Order';
import { Range } from '@/components/atoms';
import { orderTemplateContainer } from './orderTemplate.css';
import { useModal } from '@/app/hooks';

export default function OrderTemplate({
  status,
  props,
  getLastId,
}: {
  status: string;
  props: any[];
  getLastId: string | null;
}) {
  console.log('ordertemplate : ', props, getLastId);

  const [items, setItems] = useState(props);
  const [lastId, setLastId] = useState(getLastId);
  const [loading, setLoading] = useState(false);

  const { openModal } = useModal();

  const loadMore = async () => {
    if (!lastId || loading) return;

    setLoading(true);

    const res = await fetch(
      `/api/getOrderSort?status=${status}&lastId=${lastId}`
    );
    const data = await res.json();

    const { result, nextCursor } = data;
    console.log('load more data : ', result, nextCursor);

    setItems((prev) => [...prev, ...result]);
    setLastId(nextCursor);
    setLoading(false);
  };

  const handleUpdateItem = (orderId: string, newData: any) => {
    setItems((prev) =>
      prev.map((item) =>
        item.orderId === orderId ? { ...item, ...newData } : item
      )
    );
  };

  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, check: true })));
  };

  const SendBtn = () => {
    if (status === '상품 확인중') {
      // Handle send button click for 'check' status
      return (
        <button
          onClick={() => {
            openModal('선택된 주문을 모두 배송중으로 전환하시겠습니까?', () => {
              console.log('ok');
            });
          }}
          style={{
            width: '220px',
            height: '50px',
            border: 'none',
            fontSize: '18px',
            color: 'white',
            marginTop: '30px',
            backgroundColor: '#75C3FE',
            cursor: 'pointer',
          }}
        >
          선택 모두 배송중으로 변경
        </button>
      );
    } else if (status === '배송중') {
      // Handle send button click for 'sending' status
      return (
        <button onClick={handleSelectAll}>선택 모두 배송 완료로 변경</button>
      );
    }
  };

  return (
    <>
      <SendBtn />
      <div className={orderTemplateContainer}>
        {items.map((item) => (
          <Order key={item.orderId} props={item} onUpdate={handleUpdateItem} />
        ))}
      </div>
      <div>
        {lastId && (
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              width: '100%',
              margin: '40px 0',
              height: '50px',
              border: 'none',
              backgroundColor: 'lightgray',
              color: 'black',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            더 보기
          </button>
        )}
      </div>
    </>
  );
}
