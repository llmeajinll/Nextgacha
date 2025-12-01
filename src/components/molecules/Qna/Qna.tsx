'use client';

import { QnaProps } from '@/shared/type';
import React, { useState } from 'react';
import { Writer, Range } from '@/components/atoms';
import {
  qnaContainer,
  rightContent,
  rightName,
  leftContent,
  question,
  showBtn,
} from './qna.css';

export default function Qna({ props }: { props: QnaProps }) {
  const [show, setShow] = useState(false);

  const Right = ({ content }: { content: string }) => {
    return (
      <Range style={{ marginLeft: 'auto' }}>
        <Range className={rightContent}>{content}</Range>
        <div className={rightName}>ADMIN</div>
      </Range>
    );
  };

  const Left = ({ content }: { content: string }) => {
    return (
      <Range preset='between'>
        <div className={leftContent}>{content}</div>
      </Range>
    );
  };

  return (
    <Range preset='column' key={props._id} className={qnaContainer}>
      <Range gap='8'>
        <div className={question}>Q.</div>
        <div>{props.title}</div>
      </Range>
      <Range
        preset='between'
        style={{
          marginTop: '10px',
        }}
      >
        <button onClick={() => setShow(!show)} className={showBtn}>
          {show ? 'CLOSE' : 'MORE'}
        </button>
        <Writer writer={props.user} created_at={props.created_at} />
      </Range>
      {show && (
        <Range preset='column' width='full'>
          {props.request.map((v, i: number) =>
            v.writer === 'admin' ? (
              <Right key={i} content={v.content} />
            ) : (
              <Left key={i} content={v.content} />
            )
          )}
        </Range>
      )}
    </Range>
  );
}
