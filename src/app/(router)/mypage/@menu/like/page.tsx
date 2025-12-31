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
      <div className={cardTemplateContainer}>
        {like?.map((item: CardProps) => (
          <Card props={item} key={item._id} />
        ))}
      </div>
    </>
  );
}
