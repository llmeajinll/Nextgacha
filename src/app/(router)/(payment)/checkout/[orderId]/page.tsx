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
      const res = await fetch(
        `/api/protected/getOneHistory?orderId=${orderId}`
      );
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
    <div>
      <h1>결제가 완료되었습니다!</h1>
      <h3>주문 번호: {orderId}</h3>
      <div>배송지: {order?.address}</div>
      <div>결제 금액: {comma(order?.totalPrice)}원</div>
      <div>
        주문 상품:
        {(order?.list || [])?.map((value: any, index: number) => (
          <div key={index}>
            <div>{value.title}</div>
            {value.product.map((val: any, idx: number) => (
              <div key={idx} style={{ marginLeft: '15px' }}>
                {val.name} : {val.count}개
              </div>
            ))}
          </div>
        ))}
      </div>
      <Range gap='30'>
        <Link href='/' style={{ fontFamily: 'silkscreen' }}>
          HOME
        </Link>
        <Link href='/mypage/history' style={{ fontFamily: 'silkscreen' }}>
          MYPAGE
        </Link>
      </Range>
    </div>
  );
}
