'use client';

import React from 'react';
import Image from 'next/image';
import { Range } from '@/shared/ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  truckWidthVar,
  truckBody,
  truckBg,
  addressText,
  placeholder,
} from './addressTruck.css';

export default function AddressTruck({ address }: { address: string }) {
  return (
    <Range>
      <Image src='/images/Group 266.png' width={50} height={70} alt='truck1' />
      <div
        className={truckBody}
        style={assignInlineVars({
          [truckWidthVar]:
            address !== undefined ? `${address.length * 12}px` : '100%',
        })}
      >
        <img src='/images/Group 268.png' className={truckBg} alt='truck2'></img>
        <div className={addressText}>
          {address || <span className={placeholder}>주소를 입력해주세요</span>}
        </div>
      </div>
      <Image src='/images/Group 267.png' width={25} height={70} alt='truck3' />
    </Range>
  );
}
