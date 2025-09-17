'use client';
import { Btn, HeartBtn, ImgBtn, ReactSlick, Range } from '@/components/atoms';
import { DropDown, LabelTitle } from '@/components/molecules';
import { panelTitle } from './productPurchasePanel.css';
import React, { useState } from 'react';

export default function ProductPurchasePanel() {
  const [select, setSelect] = useState('');
  return (
    <Range
      width='960'
      gap='30'
      style={{
        margin: '50px auto',
      }}
    >
      <div>
        <ReactSlick />
      </div>
      <Range height='450' direction='column' justify='spacebetween'>
        <Range direction='column' gap='10'>
          <div className={panelTitle}>
            치이카와 우물우물파티 3탄 치이카와 우물우물파티 3탄 치이카와
            우물우물파티 3탄 치이카와 우물우물파티 3탄 치이카와 우물우물파티 3탄
            치이카와 우물우물파티 3탄
          </div>
          <LabelTitle label='가격' content='4,000원' />
          <LabelTitle label='갯수' content='5개' />
          <LabelTitle label='제조사' content='반다이' />
          <LabelTitle
            label='택배비'
            content='3,000원 [50,000원 이상 구매시 무료]'
          />
          <LabelTitle label='적립금' content='40p' />
        </Range>

        <Range direction='column' gap='10'>
          <LabelTitle
            label='총합'
            content='15,000원'
            status='large'
            align='right'
          />
          <DropDown select={select} setSelect={setSelect} />
          <Range gap='10' align='center'>
            <Btn text='BUY' />
            <Btn text='CART' color='reversePrimary' />
            <HeartBtn size={45} />
            <ImgBtn width={38} height={45} />
          </Range>
        </Range>
      </Range>
    </Range>
  );
}
