'use client';

import getQna from '@/api/getQna';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Writer, Range } from '@/components/atoms';
import { Qna, Private } from '@/components/molecules';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function QnaTab() {
  console.log('QnaTab');
  const [qna, setQna] = useState([]);
  const { firstRoute } = useSplitRoute();
  const userInfo = Cookies.get('userInfo');
  const email = userInfo ? JSON.parse(userInfo).email : null;

  console.log(email);
  useEffect(() => {
    async function fetchReview() {
      const review = await getQna(firstRoute)
        .then((res) => {
          console.log('qna page: ', res.result);
          return res.result;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });

      setQna(review);
    }

    fetchReview();
  }, []);

  const changeStar = (name: string) => {
    if (!name) return '';

    const [id] = name.split('@');

    if (id.length <= 3) {
      return '*'.repeat(id.length);
    }

    const visible = id.slice(0, 3);
    const masked = '*'.repeat(id.length - 3);
    return visible + masked;
  };
  return (
    <Range preset='column' gap='10' width='full'>
      {qna.length === 0 ? (
        <div>Q&A가 없습니다! 마음껏 질문을 남겨주세요!</div>
      ) : (
        qna &&
        qna.map((val: any) =>
          val.private === false ? (
            <Qna key={val._id} props={val} />
          ) : val.user === email ? (
            <Qna key={val._id} props={val} />
          ) : (
            <Private key={val._id} props={val} />
          )
        )
      )}
    </Range>
  );
}
