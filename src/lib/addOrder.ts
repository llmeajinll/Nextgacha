import { orderColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import { ClientSession } from 'mongodb';
import { findUserInfo } from './findUserInfo';
import { NextResponse } from 'next/server';

export async function addOrder({
  orderId,
  list,
  amount,
  email,
  mongodbSession,
  address,
}: {
  orderId: string;
  list: any[];
  amount: number;
  email: string;
  mongodbSession: ClientSession;
  address: string;
}) {
  // const address = await findUserInfo({ email, mongodbSession })
  //   .then((res) => {
  //     console.log('userInfo in addOrder : ', res.address);
  //     if (res.ok) return res.address;
  //   })
  //   .catch((error) => {
  //     console.error('Error finding user info in addOrder:', error);
  //     return NextResponse.json({ error: (error as Error).message });
  //   });

  const result = await orderColl
    .insertOne(
      {
        customer: email,
        orderId: orderId,
        list: list,
        address: address,
        status: '상품 확인중',
        created_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        courier: '',
        invoice: '',
        totalPrice: amount,
      },
      { session: mongodbSession }
    )
    .then((res) => {
      //   console.log('Insert Result:', res);
      return { acknowledged: res.acknowledged };
    })
    .catch((err) => {
      console.error('Error inserting product:', err);
      return { acknowledged: false };
    });

  return result;
}
