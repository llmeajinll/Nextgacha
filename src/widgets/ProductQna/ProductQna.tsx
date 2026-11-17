'use client';
import React, { useState, useEffect } from 'react';
import { Range } from '@/shared/ui';
import { Private, Qna, QnaWriteForm } from '@/features/qna/ui';
import useSplitRoute from '@/shared/hooks/useSplitRoute';
import getQna from '@/entities/qna/api/getQna';
import type { QnaProps } from '@/entities/qna/model/types';
import * as styles from './productQna.css';

// 상품 상세 Q&A 탭: 질문 쓰기(feature) + 문의 목록
export default function ProductQna() {
  const [qna, setQna] = useState<QnaProps[]>([]);
  const { firstRoute } = useSplitRoute();

  async function fetchQna() {
    setQna(await getQna(firstRoute));
  }

  useEffect(() => {
    fetchQna();
  }, []);

  return (
    <Range preset='column' gap='10' width='full'>
      <QnaWriteForm num={firstRoute} onPosted={fetchQna} />
      {qna.length === 0 ? (
        <Range width='full' className={styles.emptyState}>
          등록된 질문이 없습니다. 첫 질문을 남겨보세요!
        </Range>
      ) : (
        <div>
          {qna &&
            qna.map((val, idx) => {
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
