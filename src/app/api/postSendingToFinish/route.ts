import { NextResponse } from 'next/server';
import { orderColl, mongodbClient, userColl } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';
import dayjs from 'dayjs';

export async function POST(req: Request) {
  const data = await req.json();

  const { send } = data;
  const nowDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const session = mongodbClient.startSession();

  // 한개만
  if (send === 'one') {
    const { send, orderId, email, addPoint } = data;
    console.log(send, email, addPoint);
    try {
      const [orderResult, userResult] = await Promise.all([
        orderColl.updateOne(
          { orderId },
          { $set: { arriveDate: nowDate, status: '배송 완료' } }
        ),
        userColl.updateOne({ email }, { $inc: { point: addPoint } }),
      ]);
      console.log(orderResult, userResult);
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ ok: false, result: {} }, { status: 200 });
    }
  }
  // 한번에 여러개
  else if (send === 'many') {
    const { send, orders } = data;

    try {
      // 1. 주문 컬렉션을 위한 bulkWrite 작업 생성
      const orderOperations = orders.map((order: any) => ({
        updateOne: {
          filter: { orderId: order.orderId },
          update: {
            $set: {
              arrivedDate: nowDate,
              status: '배송 완료',
            },
          },
        },
      }));

      // 2. 유저 컬렉션을 위한 bulkWrite 작업 생성
      const userOperations = orders.map((order: any) => ({
        updateOne: {
          filter: { email: order.email },
          update: {
            $inc: {
              point: order.addPoint,
            },
          },
        },
      }));

      // 3. 각 컬렉션에 대해 bulkWrite 실행
      // 두 작업이 모두 중요하므로 Promise.all로 병렬 실행하거나 순차 실행합니다.
      const [orderResult, userResult] = await Promise.all([
        orderColl.bulkWrite(orderOperations),
        userColl.bulkWrite(userOperations),
      ]);

      console.log(
        `${orderResult.modifiedCount}개 주문 완료, ${userResult.modifiedCount}명 포인트 지급`
      );

      return NextResponse.json({
        ok: true,
        result: {
          orderResult: orderResult.modifiedCount,
          userResult: userResult.modifiedCount,
        },
      });
    } catch (error) {
      console.error('주문 업데이트 중 에러 발생:', error);
    }
    console.log(send, orders);
    return NextResponse.json({ ok: false, result: {} }, { status: 400 });
  }
}
