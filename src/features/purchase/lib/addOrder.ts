import { orderColl } from '@/shared/api/mongodb';
import { ClientSession } from 'mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';

export async function addOrder({
  orderId,
  list,
  amount,
  email,
  name,
  mongodbSession,
  address,
  addPoint,
  usedPoint,
  deviceId,
  ip,
}: {
  orderId: string;
  list: any[];
  amount: number;
  email: string;
  name: string;
  mongodbSession: ClientSession;
  address: string;
  addPoint: number;
  usedPoint: number;
  deviceId: string | null;
  ip: string | null;
}) {
  await orderColl.insertOne(
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
      usedPoint: usedPoint,
      created_at: koreaTime(),
      arrivedDate: '',
      review: false,
      deviceId,
      ip,
    },
    { session: mongodbSession },
  );
}
