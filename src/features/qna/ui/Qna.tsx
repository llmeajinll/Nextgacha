'use client';

import { QnaProps } from '@/entities/qna/model/types';
import React, { useState } from 'react';
import { Writer, Range, Btn } from '@/shared/ui';
import { useModal } from '@/shared/hooks';
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
  leftWrap,
  questionText,
  deleteBtn,
  stacked,
} from './qna.css';
import { writerStyle } from '@/shared/ui/Writer/writer.css';
import dayjs from 'dayjs';

export default function Qna({
  props,
  isWriter = false,
  num,
  stacked: isStacked,
}: {
  props: QnaProps;
  isWriter: boolean;
  num: number;
  stacked?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestInput, setRequestInput] = useState('');
  const [editInput, setEditInput] = useState(props.question);
  const { openModal, closeModal } = useModal();
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

  const onClickDeleteQuestion = async () => {
    openModal('질문을 삭제하시겠습니까?', {
      onClickCheck: async () => {
        await fetch('/api/protected/deleteQuestion', {
          method: 'POST',
          body: JSON.stringify({ num, qna_num: props.qna_num }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res.ok === true) {
            openModal('삭제되었습니다.');
            window.location.reload();
          } else {
            openModal('오류가 발생하였습니다.');
          }
        });
      },
      onClickCancel: () => {
        closeModal();
      },
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
      <Range className={leftWrap}>
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
      className={`${qnaContainer} ${isStacked ? stacked : ''}`}
    >
      <Range gap='8'>
        <div className={question}>Q.</div>
        {isEdit === false ? (
          <div className={questionText}>{props.question}</div>
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
            <button className={deleteBtn} onClick={onClickDeleteQuestion}>
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
