import React from 'react';
import { Lock } from 'pixelarticons/react';
import { Writer } from '@/shared/ui';
import { Range } from '@/shared/ui';
import { privateContainer, lockText, stacked, lockIcon } from './private.css';

export default function Private({
  props,
  stacked: isStacked,
}: {
  props: any;
  stacked?: boolean;
}) {
  return (
    <Range
      width='full'
      preset='between'
      key={props._id}
      gap='10'
      className={`${privateContainer} ${isStacked ? stacked : ''}`}
    >
      <Lock width={24} height={24} className={lockIcon} aria-hidden />
      <div className={lockText}>비밀 문의입니다.</div>
      <Writer
        writer='
  anonymity'
        created_at={props.create_at}
      />
    </Range>
  );
}
