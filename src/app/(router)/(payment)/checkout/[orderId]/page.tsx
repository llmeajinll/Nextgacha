'use client';
import { Range } from '@/components/atoms';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { comma } from '@/shared/comma';

export default function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [order, setOrder] = useState({} as any);
  const resolveParams = use(params);
  const orderId = resolveParams.orderId;

  console.log('orderId', orderId);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/getOneHistory?orderId=${orderId}`);
      const data = await res.json();
      if (data.ok) {
        console.log('res: ', data.result);
        setOrder(data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      style={{
        width: '900px',
        padding: '10px 30px 40px 30px',
        margin: '40px auto 0 auto',
        border: '4px solid #75C3FE',
      }}
    >
      <h1 style={{ color: '#3AAAFF' }}>결제가 완료되었습니다!</h1>
      <h3>
        <span style={{ display: 'inline-block', width: '100px' }}>
          주문 번호
        </span>
        {orderId}
      </h3>
      <div>
        <span
          style={{
            display: 'inline-block',
            width: '100px',
            fontWeight: '500',
            color: '#4C4C4C',
          }}
        >
          배송지
        </span>
        <span style={{ color: '#6F6F6F', fontWidth: '400' }}>
          {order?.address}
        </span>
      </div>
      <div>
        <span
          style={{
            display: 'inline-block',
            width: '100px',
            fontWeight: '500',
            color: '#4C4C4C',
          }}
        >
          결제 금액
        </span>
        <span style={{ color: '#6F6F6F', fontWidth: '400' }}>
          {comma(order?.totalPrice)}원
        </span>
      </div>
      <Range>
        <span
          style={{
            display: 'inline-block',
            width: '100px',
            fontWeight: '500',
            color: '#4C4C4C',
          }}
        >
          주문 상품
        </span>
        {(order?.list || [])?.map((value: any, index: number) => (
          <div key={index}>
            <div style={{ color: '#6F6F6F', fontWidth: '400' }}>
              {value.title}
            </div>
            <Range>
              {value.product.map((val: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    marginRight: '15px',
                    fontWidth: '400',
                    fontSize: '14px',
                  }}
                >
                  {val.name} : {val.count}개
                </div>
              ))}
            </Range>
          </div>
        ))}
      </Range>
      <Range gap='50' style={{ margin: '30px auto 0 auto' }}>
        <Link href='/' style={{ fontFamily: 'silkscreen', color: '#75C3FE' }}>
          HOME
        </Link>
        <Link
          href='/mypage/history'
          style={{ fontFamily: 'silkscreen', color: '#999999' }}
        >
          MYPAGE
        </Link>
      </Range>
    </div>
  );
}
