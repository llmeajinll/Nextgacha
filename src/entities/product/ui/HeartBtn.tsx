'use client';

import React, { useState } from 'react';
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
  const [like, setLike] = useState(status);
  const [, setModalState] = useAtom(modalAtom);
  const { openModal, closeModal } = useModal();

  // 목록을 다시 조회해 다른 상품·상태가 내려오면 맞춘다 (effect 대신 렌더 중에 조정)
  const [prev, setPrev] = useState({ num, status });
  if (prev.num !== num || prev.status !== status) {
    setPrev({ num, status });
    setLike(status);
  }

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
        if (data.ok === true) {
          setLike(data.like);
        } else {
          // alert('로그인 후 좋아요를 누를 수 있습니다.');
          openModal('로그인 후 좋아요를 누를 수 있습니다.');
        }
      })
      .catch((err) => {
        console.error(err);
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
