'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Range, Btn } from '@/components/atoms';
import { detailTabContainer } from './detailtab.css';
import useSplitRoute from '@/app/hooks/useSplitRoute';

export default function DetailTab({ status = 'detail' }: { status?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { route } = useSplitRoute();

  return (
    <>
      {status === 'detail' ? (
        <div className={detailTabContainer}>
          <Btn
            size='big'
            color={route[1] === 'info' ? 'primary' : 'reversePrimary'}
            onClick={() => {
              router.replace(`/${route[0]}/info`);
            }}
          >
            INFO
          </Btn>
          <Btn
            size='big'
            color={route[1] === 'qna' ? 'primary' : 'reversePrimary'}
            onClick={() => {
              router.replace(`/${route[0]}/qna`);
            }}
            style={{ marginLeft: '-1px' }}
          >
            Q&A
          </Btn>
          <Btn
            size='big'
            color={route[1] === 'review' ? 'primary' : 'reversePrimary'}
            onClick={() => {
              router.replace(`/${route[0]}/review`);
            }}
            style={{ marginLeft: '-1px' }}
          >
            REVIEW
          </Btn>
        </div>
      ) : (
        <Range>
          <Btn
            color={route[1] === 'cart' ? 'primary' : 'reversePrimary'}
            onClick={() => router.replace(`/${route[0]}/cart`)}
          >
            CART
          </Btn>
          <Btn
            color={route[1] === 'like' ? 'primary' : 'reversePrimary'}
            onClick={() => router.replace(`/${route[0]}/like`)}
            style={{ marginLeft: '-1px' }}
          >
            LIKE
          </Btn>
          <Btn
            color={route[1] === 'history' ? 'primary' : 'reversePrimary'}
            onClick={() => router.replace(`/${route[0]}/history?page=1`)}
            style={{ marginLeft: '-1px' }}
          >
            HISTORY
          </Btn>
        </Range>
      )}
    </>
  );
}
