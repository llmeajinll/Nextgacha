'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import { modalAtom } from '@/shared/model/store';
import { useModal } from '@/shared/hooks';
import { ImgBtn } from '@/shared/ui';

export default function HeartBtn({
  size = 28,
  status,
  num,
  className,
}: {
  size?: number;
  status?: boolean;
  num: number;
  className?: string;
}) {
  // console.log(num, status);
  const [like, setLike] = useState(status);
  const [modalState, setModalState] = useAtom(modalAtom);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    setLike(status);
  }, [num, status]);

  const onClickHeartBtn = async () => {
    await fetch('/api/protected/updateLike', {
      method: 'POST',
      body: JSON.stringify(num),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        // console.log('heart button update : ', data);
        if (data.ok === true) {
          setLike(data.like);
        } else {
          // alert('로그인 후 좋아요를 누를 수 있습니다.');
          openModal('로그인 후 좋아요를 누를 수 있습니다.');
          console.log('modalState : ', modalState);
        }
      })
      .catch((err) => {
        console.log(err);
        setModalState({
          isOpen: true,
          message: '오류가 발생하였습니다.',
        });
      });
  };

  return (
    <ImgBtn
      img='heart'
      size={size}
      title='좋아요'
      active={!!like}
      onClick={onClickHeartBtn}
      className={className}
    />
  );
}
