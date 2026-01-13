'use client';

import { QnaProps } from '@/shared/type';
import React, { useState } from 'react';
import { Writer, Range, Btn } from '@/components/atoms';
import { useModal } from '@/app/hooks';
import {
  qnaContainer,
  rightContent,
  masterName,
  leftContent,
  question,
  showBtn,
  scrollRange,
  wrapRequestInput,
  requestInputStyle,
  postBtn,
  countLength,
  qnaDeleteBtn,
  editQuestionInput,
} from './qna.css';
import { writerStyle } from '../../atoms/Writer/writer.css';
import dayjs from 'dayjs';

export default function Qna({
  props,
  isWriter = false,
  num,
  style,
}: {
  props: QnaProps;
  isWriter: boolean;
  num: number;
  style?: React.CSSProperties;
}) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestInput, setRequestInput] = useState('');
  const [editInput, setEditInput] = useState(props.question);
  const { openModal } = useModal();
  console.log(props);

  const onSendRequest = async () => {
    const data = {
      num,
      qna_num: props.qna_num,
      requestInput,
    };

    await fetch('/api/protected/postRequestQna', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok === true) {
          openModal(
            '질문이 추가되었습니다.',

            {
              onClickCheck: () => window.location.reload(),
              onClickClose: () => window.location.reload(),
            }
          );
        } else {
          openModal('오류가 발생했습니다.', {
            onClickCheck: () => window.location.reload(),
            onClickClose: () => window.location.reload(),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        openModal(
          '오류가 발생하였습니다.',

          {
            onClickCheck: () => window.location.reload(),
            onClickClose: () => window.location.reload(),
          }
        );
      });
  };

  const onClickEditQuestion = async () => {
    if (editInput.length === 0) {
      openModal('수정 내용을 적어주세요.');
      return;
    }
    if (editInput.length > 1 && editInput.length <= 10) {
      openModal('10자 이상 적어주세요!');
      return;
    }
    const data = {
      edit: editInput,
      qna_num: props.qna_num,
      num,
    };

    await fetch('/api/protected/updateQna', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok === true) {
          openModal(
            '질문이 수정되었습니다.',

            {
              onClickCheck: () => window.location.reload(),
              onClickClose: () => window.location.reload(),
            }
          );
        } else {
          openModal(
            '오류가 발생하였습니다.',

            {
              onClickCheck: () => window.location.reload(),
              onClickClose: () => window.location.reload(),
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        openModal(
          '오류가 발생하였습니다.',

          {
            onClickCheck: () => window.location.reload(),
            onClickClose: () => window.location.reload(),
          }
        );
      });
  };

  const Left = ({ content }: { content: string }) => {
    return (
      <Range style={{ marginLeft: 'auto' }}>
        <Range className={leftContent}>{content}</Range>
      </Range>
    );
  };

  const Right = ({ content }: { content: string }) => {
    return (
      <Range>
        <div className={masterName}>MASTER</div>
        <div className={rightContent}>{content}</div>
      </Range>
    );
  };

  return (
    <Range
      preset='column'
      key={props.qna_num}
      className={qnaContainer}
      style={{ ...style }}
    >
      <Range gap='8'>
        <div className={question}>Q.</div>
        {isEdit === false ? (
          <div style={{ marginTop: '5px' }}>{props.question}</div>
        ) : (
          <input
            value={editInput}
            className={editQuestionInput}
            onChange={(e) => setEditInput(e.target.value)}
          />
        )}
      </Range>
      <Range
        preset='between'
        // style={{
        //   marginTop: '10px',
        // }}
      >
        {isWriter && (
          <Range>
            <button
              className={qnaDeleteBtn}
              style={{ marginLeft: '28px', color: '#75C3FE' }}
            >
              delete
            </button>

            <button
              className={qnaDeleteBtn}
              onClick={async () => {
                if (isEdit === false) {
                  setIsEdit(true);
                } else {
                  // 질문 수정
                  onClickEditQuestion();
                }
              }}
            >
              {isEdit === false ? 'edit' : 'done'}
            </button>

            {isEdit === true && (
              <button className={qnaDeleteBtn} onClick={() => setIsEdit(false)}>
                close
              </button>
            )}
          </Range>
        )}
        <Writer writer={props.email} created_at={props.created_at} />
      </Range>
      {show && (
        <>
          <div className={scrollRange}>
            <Range preset='column' width='full' gap='5'>
              {props.request.map((v, i: number) =>
                v.writer === 'master' ? (
                  <Right key={i} content={v.content} />
                ) : (
                  <Left key={i} content={v.content} />
                )
              )}
            </Range>
          </div>
          {isWriter && (
            <Range gap='10' className={wrapRequestInput}>
              <input
                className={requestInputStyle}
                placeholder='질문을 작성해주세요.'
                maxLength={150}
                value={requestInput}
                onChange={(e) => setRequestInput(e.target.value)}
              />
              <div className={countLength}>{requestInput.length} / 150</div>
              <Btn className={postBtn} onClick={onSendRequest}>
                post
              </Btn>
            </Range>
          )}
        </>
      )}
      {props.request.length !== 0 && (
        <button onClick={() => setShow(!show)} className={showBtn}>
          {show ? 'CLOSE' : `MORE (${props.request.length})`}
        </button>
      )}
    </Range>
  );
}
