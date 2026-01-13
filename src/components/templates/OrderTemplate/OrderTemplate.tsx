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
  // console.log('ordertemplate : ', props, getLastId);

  const [items, setItems] = useState(props);
  const [lastId, setLastId] = useState(getLastId);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);

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
    setItems((prev) => prev.map((item) => ({ ...item, check: check })));
    setCheck(!check);
  };

  const SendBtn = () => {
    if (status === '상품 확인중') {
      // Handle send button click for 'check' status
      return (
        <button
          onClick={() => {
            openModal('선택된 주문을 모두 배송중으로 전환하시겠습니까?', {
              onClickCheck: async () => {
                const isValidate = items
                  .filter((item) => item.check)
                  .every((item) => item.courier && item.invoice);
                if (!isValidate) {
                  alert('택배사나 송장번호가 적혀있지 않은 주문이 있습니다.');
                  return;
                }

                const orders = items.filter((val) => val.check === true);
                console.log(orders);

                try {
                  const res = await fetch('/api/postCheckToSending', {
                    method: 'POST',
                    body: JSON.stringify({
                      send: 'many',
                      orders,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });

                  const result = await res.json();
                  console.log(result);
                  if (result.ok === true) {
                    alert('전체 반영되엇습니다.');
                    window.location.reload();
                  } else {
                    alert('전체 반영되지 못했습니다.');
                    window.location.reload();
                  }
                } catch (err) {
                  alert('오류가 발생했습니다.');
                  window.location.reload();
                }
              },
            });
          }}
          style={{
            padding: '0 20px',
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
        <Range gap='5'>
          <button
            onClick={handleSelectAll}
            style={{
              padding: '0 20px',
              height: '50px',
              border: 'none',
              fontSize: '18px',
              color: 'white',
              marginTop: '30px',
              backgroundColor: '#75C3FE',
              cursor: 'pointer',
            }}
          >
            전체 선택
          </button>
          <button
            onClick={async () => {
              const orders = items.filter((val) => val.check === true);
              try {
                const res = await fetch('/api/postSendingToFinish', {
                  method: 'POST',
                  body: JSON.stringify({
                    send: 'many',
                    orders,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                const result = await res.json();
                console.log(result);
                if (result.ok === true) {
                  alert('전체 반영되었습니다.');
                  window.location.reload();
                } else {
                  alert('전체 반영되지 못했습니다.');
                  window.location.reload();
                }
              } catch (err) {
                alert('오류가 발생했습니다.');
                window.location.reload();
              }
            }}
            style={{
              padding: '0 20px',
              height: '50px',
              border: 'none',
              fontSize: '18px',
              color: 'white',
              marginTop: '30px',
              backgroundColor: '#5bdb44',
              cursor: 'pointer',
            }}
          >
            선택된 주문 배송 완료로 변경
          </button>
        </Range>
      );
    } else {
      return;
    }
  };

  return (
    <>
      <SendBtn />
      {items.length === 0 ? (
        <h2>주문건이 없습니다.</h2>
      ) : (
        <div className={orderTemplateContainer}>
          {items.map((item) => (
            <Order
              key={item.orderId}
              props={item}
              onUpdate={handleUpdateItem}
            />
          ))}
        </div>
      )}
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
              color: '#444',
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
