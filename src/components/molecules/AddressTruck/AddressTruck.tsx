'use client';

import React from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';

export default function AddressTruck({ address }: { address: string }) {
  return (
    <Range>
      <Image src='/images/Group 266.png' width={50} height={70} alt='truck1' />
      <div
        style={{
          position: 'relative',
          width: `${
            address !== undefined ? address.length * 12 + 'px' : '100%'
          }`,
          minWidth: '245px',
        }}
      >
        <img
          src='/images/Group 268.png'
          // width={245}
          // height={70}
          style={{ width: '100%', height: '70px' }}
          alt='truck2'
        ></img>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '100%',
            top: 0,
            height: '50px',
            padding: '12px 10px 10px 10px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {address || (
            <span style={{ color: '#3aaaff' }}>주소를 입력해주세요</span>
          )}
        </div>
      </div>
      <Image src='/images/Group 267.png' width={25} height={70} alt='truck3' />
    </Range>
  );
}
