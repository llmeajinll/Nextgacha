import { orderColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import { ClientSession } from 'mongodb';

export async function addOrder({
  orderId,
  list,
  amount,
  email,
  mongodbSession,
}: {
  orderId: string;
  list: any[];
  amount: number;
  email: string;
  mongodbSession: ClientSession;
}) {
  const result = await orderColl
    .insertOne(
      {
        customer: email,
        orderId: orderId,
        list: list,
        address: '경기도 이천시 이천대로 56-6 103호',
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
