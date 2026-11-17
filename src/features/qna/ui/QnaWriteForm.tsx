'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useModal } from '@/shared/hooks';
import { ImgBtn, Range, ToggleBtn } from '@/shared/ui';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import postQna from '../api/postQna';
import * as styles from './qnaWriteForm.css';

// 상품 상세 Q&A 탭의 질문 쓰기. 로그인했을 때만 보인다. 등록되면 onPosted로 목록을 다시 부른다
export default function QnaWriteForm({ num, onPosted }: { num: string; onPosted: () => void }) {
  const [question, setQuestion] = useState('');
  const [secret, setSecret] = useState(false);
  const { openModal, closeModal } = useModal();
  const session = useSession();
  const userInfo = session?.data?.user ?? null;

  const fetchPostQna = async (data: { num: string; email: string; question: string; secret: boolean }) => {
    const ok = await postQna(data);
    setSecret(false);
    setQuestion('');
    if (ok) {
      openModal('질문이 등록되었습니다.', { onClickCheck: onPosted, onClickClose: onPosted });
    } else {
      openModal('오류로 인해 질문이 등록되지 못했습니다.', {
        onClickCheck: () => window.location.reload(),
        onClickClose: () => window.location.reload(),
      });
    }
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
          num,
          email: userInfo?.email || '',
          question: question.trim(),
          secret,
        };
        await fetchPostQna(data);
      },
      onClickCancel: () => closeModal(),
    });
  };

  if (!userInfo?.email) return null;

  return (
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
  );
}
