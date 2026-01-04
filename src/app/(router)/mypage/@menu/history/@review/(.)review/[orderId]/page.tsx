'use client';
import React, { use } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewModal({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const orderIdParams = use(params);
  const orderId = orderIdParams.orderId;

  return (
    <div
      className='modal-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className='modal-content'
        style={{ background: 'white', padding: '40px', borderRadius: '8px' }}
      >
        <h2>리뷰 작성하기 (ID: {orderId})</h2>
        {/* 리뷰 폼 내용 */}
        <button onClick={() => router.back()}>닫기</button>
      </div>
    </div>
  );
}
