'use client';

import React, { useState, useEffect } from 'react';
// import getLike from '@/api/getLike';
import { cardTemplateContainer } from '@/components/templates/CardTemplate/cardTemplate.css';
import { Range } from '@/components/atoms';
import { Card, EmptyCard } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

export default function page() {
  const [like, setLike] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLikeData = async (page: number) => {
    await fetch(`/api/protected/getLike?page=${page}`)
      .then(async (res) => {
        // console.log(res);
        const data = await res.json();
        console.log(data);
        if (data.ok === true) {
          setLike(data.result.likeResult);
          setTotal(data.result.total);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchLikeData(currentPage);
  }, []);

  // console.log(like);

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
          <Range style={{ margin: '80px auto 30px auto' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={20}
              onChange={(page) => {
                console.log('onChange page : ', page);
                setCurrentPage(page);
                fetchLikeData(page);
              }}
            />
          </Range>
        </>
      )}
    </>
  );
}
