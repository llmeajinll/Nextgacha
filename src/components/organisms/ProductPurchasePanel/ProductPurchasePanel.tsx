'use client';
import { Btn, HeartBtn, ImgBtn, ReactSlick, Range } from '@/components/atoms';
import { DropDown } from '@/components/molecules';
import React, { useState } from 'react';

export default function ProductPurchasePanel() {
  const [select, setSelect] = useState('');
  return (
    <Range
      width='960'
      gap='30'
      addStyle={{
        margin: '50px auto',
      }}
    >
      <div>
        <ReactSlick />
      </div>
      <Range direction='column' gap='10'>
        <DropDown select={select} setSelect={setSelect} />
        <Range gap='10' align='center'>
          <Btn text='BUY' />
          <Btn text='CART' color='reversePrimary' />
          <HeartBtn size={45} />
          <ImgBtn width={38} height={45} />
        </Range>
      </Range>
    </Range>
  );
}
