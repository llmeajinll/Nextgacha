import { orderColl } from '@/shared/api/mongodb';
import type { ClientSession } from 'mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import type { OrderLine } from './orderPolicy';

export async function addOrder({
  orderId,
  paymentKey,
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
  paymentKey: string;
  list: OrderLine[];
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
      // 환불·대사 때 Toss 조회 없이 바로 취소 (payments.md "주문에 결제 식별자 저장")
      paymentKey,
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
