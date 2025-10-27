'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Range, Btn } from '@/components/atoms';
import { detailTabContainer } from './detailtab.css';
import useSplitRoute from '@/app/hooks/useSplitRoute';

export default function DetailTab() {
  const router = useRouter();
  const pathname = usePathname();

  const { route } = useSplitRoute();

  return (
    <div className={detailTabContainer}>
      <Btn
        size='big'
        color={route[1] === 'info' ? 'primary' : 'reversePrimary'}
        onClick={() => {
          router.push(`/${route[0]}/info`);
        }}
      >
        INFO
      </Btn>
      <Btn
        size='big'
        color={route[1] === 'qna' ? 'primary' : 'reversePrimary'}
        onClick={() => {
          router.push(`/${route[0]}/qna`);
        }}
        style={{ marginLeft: '-1px' }}
      >
        Q&A
      </Btn>
      <Btn
        size='big'
        color={route[1] === 'review' ? 'primary' : 'reversePrimary'}
        onClick={() => {
          router.push(`/${route[0]}/review`);
        }}
        style={{ marginLeft: '-1px' }}
      >
        REVIEW
      </Btn>
    </div>
  );
}
