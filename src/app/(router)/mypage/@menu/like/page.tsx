'use client';

import React, { useState, useEffect } from 'react';
// import getLike from '@/api/getLike';
import { cardTemplateContainer } from '@/components/templates/CardTemplate/cardtemplate.css';
import { Card } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import { cookies } from 'next/headers';

export default function page() {
  const [like, setLike] = useState([]);

  useEffect(() => {
    const fetchLikeData = async () => {
      await fetch('/api/protected/getLike')
        .then(async (res) => {
          // console.log(res);
          const data = await res.json();
          if (data.ok === true) {
            setLike(data.result);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchLikeData();
  }, []);

  // console.log(like);

  return (
    <>
      {like.length === 0 ? (
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: '130px',
            padding: '20px',
            border: '1px solid lightgray',
            fontFamily: 'silkscreen',
            color: 'gray',
            fontSize: '30px',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: '24px',
            marginTop: '15px',
          }}
        >
          LIKE IS EMPTY
        </div>
      ) : (
        <div className={cardTemplateContainer}>
          {like?.map((item: CardProps) => (
            <Card props={item} key={item._id} />
          ))}
        </div>
      )}
    </>
  );
}
