'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useModal } from '@/app/hooks';
import { ImgBtn, Range, ToggleBtn } from '@/components/atoms';
import { Private, Qna } from '@/components/molecules';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import * as styles from './qnaTemplate.css';

export default function QnaTemplate() {
  const [qna, setQna] = useState([]);
  const [question, setQuestion] = useState('');
  const [secret, setSecret] = useState(false);
  const { firstRoute } = useSplitRoute();
  const { openModal, closeModal } = useModal();
  const session = useSession();
  const userInfo = session?.data?.user ?? null;

  // QNA 가져오기
  useEffect(() => {
    async function fetchQna() {
      const qnaResult = await fetch(`/api/getQna?num=${firstRoute}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          const data = await res.json();
          console.log('qna page: ', data.result);

          return data.result.qna;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });

      setQna(qnaResult);
    }

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
      console.log('res : ', res);
      if (res.ok) {
        setSecret(false);
        setQuestion('');
        openModal('리뷰가 등록되었습니다.', {
          onClickCheck: () => {
            window.location.reload();
          },
          onClickClose: () => {
            window.location.reload();
          },
        });
      } else {
        setSecret(false);
        setQuestion('');
        openModal('오류로 인해 리뷰가 등록되지 못했습니다.', {
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
    if (question.length === 0) {
      openModal('리뷰를 작성해주세요.');
      return;
    }

    if (question.length > 1 && question.length <= 10) {
      openModal('10자 이상 적어주세요!');
      return;
    }

    openModal('리뷰를 등록하시겠습니까?', {
      onClickCheck: async () => {
        const data = {
          num: firstRoute,
          email: userInfo?.email || '',
          question,
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
              style={{
                border: '2px solid #BFE3FF',
                borderRadius: '50px',
                backgroundColor: 'white',
                backgroundSize: '120%',
              }}
            />
            <Range width='full' preset='column'>
              <textarea
                placeholder='궁금한 내용을 물어보세요!'
                maxLength={150}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={styles.textareaStyle}
              />
              <div style={{ marginLeft: 'auto', fontFamily: 'silkscreen' }}>
                {question.length} / 150
              </div>
            </Range>
          </Range>
          <Range width='full' preset='between'>
            <Range
              gap='5'
              style={{
                fontFamily: 'silkscreen',
                alignItem: 'center',
                paddingTop: '3px',
              }}
            >
              <ToggleBtn
                value={secret}
                setValue={setSecret}
                rotate='vertical'
              />
              <Range style={{ paddingTop: '3px', color: '#6F6F6F' }}>
                Private
              </Range>
            </Range>
            <ImgBtn
              width={48}
              height={32}
              img='post'
              style={{ marginLeft: 'auto' }}
              onClick={onClickPostReview}
            />
          </Range>
        </Range>
      )}
      {qna.length === 0 ? (
        <Range
          width='full'
          style={{
            boxSizing: 'border-box',
            border: '1px solid lightgray',
            padding: '50px',
            fontSize: '20px',
          }}
        >
          등록된 질문이 없습니다. 첫 질문을 남겨보세요!
        </Range>
      ) : (
        <div>
          {qna &&
            qna.map((val: any, idx: number) => {
              // 1. 공개글이거나(false) 2. 내가 작성자인 경우 true
              const canView =
                val.secret === false || val.email === userInfo?.email;

              return (
                <div key={val.qna_num}>
                  {canView ? (
                    <Qna
                      key={val.qna_num}
                      props={val}
                      isWriter={val.email === userInfo?.email}
                      num={Number(firstRoute)}
                      style={{ marginTop: idx !== 0 ? '-1px' : undefined }}
                    />
                  ) : (
                    <Private
                      key={val.qna_num}
                      props={val}
                      style={{ marginTop: idx !== 0 ? '-1px' : undefined }}
                    />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </Range>
  );
}
