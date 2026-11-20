'use client';

import React, { useState, useEffect } from 'react';
import { CardGrid } from '@/entities/product/ui';
import type { CardProps } from '@/entities/product/model/types';
import getLike from '@/entities/product/api/getLike';
import { EmptyCard, Pagination } from '@/shared/ui';
import { paginationWrap } from './likeList.css';

export default function LikeList() {
  const [like, setLike] = useState<CardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLikeData = async (page: number) => {
    setLoading(true);
    const result = await getLike(page);
    if (result) {
      setLike(result.likeResult);
      setTotal(result.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLikeData(currentPage);
  }, []);


  if (loading) {
    return <EmptyCard>LIKE LOADING...</EmptyCard>;
  }

  return (
    <>
      {like.length === 0 ? (
        <EmptyCard>LIKE IS EMPTY</EmptyCard>
      ) : (
        <>
          <CardGrid items={like} />
          <Pagination
            className={paginationWrap}
            current={currentPage}
            total={total}
            pageSize={20}
            onChange={(page) => {
              setCurrentPage(page);
              fetchLikeData(page);
            }}
          />
        </>
      )}
    </>
  );
}
