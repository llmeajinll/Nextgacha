'use server';

import React from 'react';
import getLike from '@/api/getLike';
import { cardTemplateContainer } from '@/components/organisms/CardTemplate/cardtemplate.css';
import { Card } from '@/components/molecules';
import { CardProps } from '@/shared/type';
import { cookies } from 'next/headers';

export default async function page() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('userInfo');
  const userInfo = userInfoCookie
    ? JSON.parse(userInfoCookie.value)
    : { like: [] };
  const like = userInfo.like ?? [];
  console.log(like);
  const products = await getLike(like)
    .then((res) => {
      return res.result;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
  console.log('products : ', products);

  return (
    <>
      <div className={cardTemplateContainer}>
        {products.map((item: CardProps) => (
          <Card props={item} key={item._id} />
        ))}
      </div>
    </>
  );
}
