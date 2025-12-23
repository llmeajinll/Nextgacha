'use client';

import React, { useState, useEffect } from 'react';
// import getLike from '@/api/getLike';
import { cardTemplateContainer } from '@/components/templates/CardTemplate/cardtemplate.css';
import { Card } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import { cookies } from 'next/headers';

export default function page() {
  // const cookieStore = await cookies();
  // const userInfoCookie = cookieStore.get('userInfo');
  // const userInfo = userInfoCookie
  //   ? JSON.parse(userInfoCookie.value)
  //   : { like: [] };
  // const like = userInfo.like ?? [];
  // console.log(like);
  const [like, setLike] = useState([]);

  useEffect(() => {
    const fetchLikeData = async () => {
      await fetch('/api/protected/getLike')
        .then(async (res) => {
          const data = await res.json();
          if (data.ok === true) {
            setLike(data.result);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchLikeData();
  }, []);

  console.log(like);
  // const products = await getLike()
  //   .then((res) => {
  //     // console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return [];
  //   });
  // console.log('products : ', products);

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
