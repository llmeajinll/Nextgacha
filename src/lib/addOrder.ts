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
  name,
  mongodbSession,
  address,
  addPoint,
}: {
  orderId: string;
  list: any[];
  amount: number;
  email: string;
  name: string;
  mongodbSession: ClientSession;
  address: string;
  addPoint: number;
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

  // console.log('list in addOrder : ', list);

  const result = await orderColl
    .insertOne(
      {
        customer: name,
        email: email,
        orderId: orderId,
        list: list,
        address: address,
        status: '상품 확인중',
        courier: '',
        invoice: '',
        totalPrice: amount,
        addPoint: addPoint,
        created_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        arrivedDate: '',
      },
      { session: mongodbSession }
    )
    .then((res) => {
      console.log('Insert Result:', res);
      return {
        ok: res.acknowledged,
        data: {
          orderId: orderId,
          list: list,
          address: address,
          totalPrice: amount,
          addPoint: addPoint,
          arrivedDate: '',
        },
      };
    })
    .catch((err) => {
      console.error('Error inserting product:', err);
      return { ok: false, data: {} };
    });

  return { result };
}
