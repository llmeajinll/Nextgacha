'use client';
import { Range } from '@/shared/ui';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { comma } from '@/shared/lib/comma';
import {
  pageContainer,
  heading,
  labelInline,
  fieldLabel,
  fieldValue,
  productItem,
  footerRow,
  footerLinkHome,
  footerLinkMypage,
} from './page.css';

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
    <div className={pageContainer}>
      <h1 className={heading}>결제가 완료되었습니다!</h1>
      <h3>
        <span className={labelInline}>주문 번호</span>
        {orderId}
      </h3>
      <div>
        <span className={fieldLabel}>배송지</span>
        <span className={fieldValue}>{order?.address}</span>
      </div>
      <div>
        <span className={fieldLabel}>결제 금액</span>
        <span className={fieldValue}>{comma(order?.totalPrice)}원</span>
      </div>
      <Range>
        <span className={fieldLabel}>주문 상품</span>
        {(order?.list || [])?.map((value: any, index: number) => (
          <div key={index}>
            <div className={fieldValue}>{value.title}</div>
            <Range>
              {value.product.map((val: any, idx: number) => (
                <div key={idx} className={productItem}>
                  {val.name} : {val.count}개
                </div>
              ))}
            </Range>
          </div>
        ))}
      </Range>
      <Range gap='50' className={footerRow}>
        <Link href='/' className={footerLinkHome}>
          HOME
        </Link>
        <Link href='/mypage/history' className={footerLinkMypage}>
          MYPAGE
        </Link>
      </Range>
    </div>
  );
}
