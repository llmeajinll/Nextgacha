import React from 'react';
import Image from 'next/image';
import { Writer } from '@/components/atoms';
import { Range } from '@/components/atoms';
import { privateContainer } from './private.css';

export default function Private({ props }: { props: any }) {
  return (
    <Range
      width='full'
      preset='between'
      key={props._id}
      gap='10'
      className={privateContainer}
    >
      <Image src='/images/lock.png' alt='lock' width={24} height={24} />
      <div style={{ lineHeight: '26px' }}>비밀 문의입니다.</div>
      <Writer
        writer='
  anonymity'
        created_at={props.create_at}
      />
    </Range>
  );
}
