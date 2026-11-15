'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { cardTemplateContainer } from '@/widgets/CardTemplate/cardtemplate.css';
import { Card } from '@/entities/product/ui';
import { EmptyCard } from '@/shared/ui';
import { CardProps } from '@/entities/product/model/types';
import { Pagination } from '@/shared/ui';
import { paginationWrap } from './page.css';

export default function Page() {
  const [like, setLike] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLikeData = async (page: number) => {
    setLoading(true);
    try {
      await fetch(`/api/protected/getLike?page=${page}`)
        .then(async (res) => {
          const data = await res.json();
          if (data.ok === true) {
            setLike(data.result.likeResult);
            setTotal(data.result.total);
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error('fetch getLike error:', err);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
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
          <div className={cardTemplateContainer}>
            {like?.map((item: CardProps) => (
              <Card props={item} key={item._id} />
            ))}
          </div>
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
