'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useModal } from '@/shared/hooks';
import { ImgBtn, Range, ToggleBtn } from '@/shared/ui';
import { Private, Qna } from '@/features/qna/ui';
import useSplitRoute from '@/shared/hooks/useSplitRoute';
import * as styles from './qnaTemplate.css';
import { textareaBox, textareaCount } from '@/styles/ui.css';

export default function QnaTemplate() {
  const [qna, setQna] = useState([]);
  const [question, setQuestion] = useState('');
  const [secret, setSecret] = useState(false);
  const { firstRoute } = useSplitRoute();
  const { openModal, closeModal } = useModal();
  const session = useSession();
  const userInfo = session?.data?.user ?? null;

  async function fetchQna() {
    const qnaResult = await fetch(`/api/getQna?num=${firstRoute}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        // console.log('qna page: ', data.result);

        return data.result.qna;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    setQna(qnaResult);
  }

  // QNA 가져오기
  useEffect(() => {
    fetchQna();
  }, []);

  // 리뷰 작성 보내는 api
  const fetchPostQna = async (data: any) => {
    await fetch('/api/protected/postQna', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      // console.log('res : ', res);
      if (res.ok) {
        setSecret(false);
        setQuestion('');
        openModal('질문이 등록되었습니다.', {
          onClickCheck: () => {
            fetchQna();
          },
          onClickClose: () => {
            fetchQna();
          },
        });
      } else {
        setSecret(false);
        setQuestion('');
        openModal('오류로 인해 질문이 등록되지 못했습니다.', {
          onClickCheck: () => {
            window.location.reload();
          },
          onClickClose: () => {
            window.location.reload();
          },
        });
      }
    });
  };

  // 리뷰 작성 후 저장하는 button onClick 이벤트
  const onClickPostReview = async () => {
    if (question.trim().length === 0) {
      openModal('질문을 작성해주세요.');
      return;
    }

    if (question.trim().length > 1 && question.trim().length <= 10) {
      openModal('10자 이상 적어주세요!');
      return;
    }

    openModal('질문을 등록하시겠습니까?', {
      onClickCheck: async () => {
        const data = {
          num: firstRoute,
          email: userInfo?.email || '',
          question: question.trim(),
          secret,
        };
        await fetchPostQna(data);
      },
      onClickCancel: () => closeModal(),
    });
  };

  return (
    <Range preset='column' gap='10' width='full'>
      {userInfo?.email && (
        <Range
          gap='10'
          width='full'
          preset='column'
          className={styles.wrapQnaContainer}
        >
          <Range gap='10' className={styles.wrapTextareaContainer}>
            <Image
              src={userInfo?.image || '/images/defaultImg.png'}
              alt='profile'
              width={50}
              height={50}
              className={styles.profileImage}
            />
            <Range width='full' preset='column'>
              <div className={textareaBox}>
                <textarea
                  placeholder='궁금한 내용을 물어보세요!'
                  maxLength={150}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={styles.textareaStyle}
                />
                <span className={textareaCount}>{question.length}/150</span>
              </div>
            </Range>
          </Range>
          <Range width='full' preset='between'>
            <Range gap='5' className={styles.secretToggleRow}>
              <ToggleBtn
                value={secret}
                setValue={setSecret}
                label='비밀 문의'
              />
              <Range className={styles.secretLabel}>Private</Range>
            </Range>
            <ImgBtn
              width={48}
              height={32}
              img='post'
              className={styles.postBtn}
              onClick={onClickPostReview}
            />
          </Range>
        </Range>
      )}
      {qna.length === 0 ? (
        <Range width='full' className={styles.emptyState}>
          등록된 질문이 없습니다. 첫 질문을 남겨보세요!
        </Range>
      ) : (
        <div>
          {qna &&
            qna.map((val: any, idx: number) => {
              // 1. 공개글이거나(false) 2. 내가 작성자인 경우 true
              const canView = val.secret === false || val.isMine;

              return (
                <div key={val.qna_num}>
                  {canView ? (
                    <Qna
                      key={val.qna_num}
                      props={val}
                      isWriter={val.isMine}
                      num={Number(firstRoute)}
                      stacked={idx !== 0}
                    />
                  ) : (
                    <Private key={val.qna_num} props={val} stacked={idx !== 0} />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </Range>
  );
}
