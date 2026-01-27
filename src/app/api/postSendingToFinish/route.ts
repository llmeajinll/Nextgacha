import { NextResponse } from 'next/server';
import { orderColl, mongodbClient, userColl } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';
import dayjs from 'dayjs';
import { AnyBulkWriteOperation } from 'mongodb';
import { koreaTime } from '@/shared/koreaTime';

export async function POST(req: Request) {
  const data = await req.json();

  const { send } = data;
  // const nowDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  // const session = mongodbClient.startSession();

  // 한개만
  if (send === 'one') {
    const { orderId, email, addPoint, order } = data;

    // console.log('order;', order);

    let bulkOps = [];

    for (const group of order) {
      const currentNum = group.num; // list.num 대신 정확한 경로 참조

      for (const product of group.product) {
        // (A) 수량 차감
        bulkOps.push({
          updateOne: {
            filter: {
              email,
              'keep.num': currentNum,
              'keep.product.name': product.name,
            },
            update: {
              $inc: { 'keep.$[outer].product.$[inner].count': -product.count },
            },
            arrayFilters: [
              { 'outer.num': currentNum },
              { 'inner.name': product.name },
            ],
          },
        });
      }

      // (B) 해당 num 그룹 내 0이하 상품 제거 (그룹별로 한 번만 수행)
      bulkOps.push({
        updateOne: {
          filter: { email, 'keep.num': currentNum },
          update: { $pull: { 'keep.$.product': { count: { $lte: 0 } } } },
        },
      });

      // (C) 빈 그룹 제거
      bulkOps.push({
        updateOne: {
          filter: {
            email,
            'keep.num': currentNum,
            'keep.product': { $size: 0 },
          },
          update: { $pull: { keep: { num: currentNum } } },
        },
      });
    }

    try {
      const [orderResult, userResult, keepResult] = await Promise.all([
        orderColl.updateOne(
          { orderId },
          { $set: { arriveDate: koreaTime, status: '배송 완료' } },
        ),
        userColl.updateOne({ email }, { $inc: { point: addPoint } }),
        userColl.bulkWrite(bulkOps as AnyBulkWriteOperation<any>[], {
          ordered: true,
        }),
      ]);
      console.log(orderResult, userResult, keepResult);
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ ok: false, result: {} }, { status: 200 });
    }
  }
  // 한번에 여러개
  else if (send === 'many') {
    const { send, orders } = data;

    let bulkOps = [];
    console.log(orders);

    for (const item of orders) {
      const { num, list, email } = item;
      console.log('num, list, email : ', num, list, email);
      for (const product of list) {
        // (A) 수량 차감: 해당 num과 name을 찾아 count를 마이너스(-) 처리
        console.log('product : ', product);
        bulkOps.push({
          updateOne: {
            filter: {
              email: email,
              'keep.num': list.num,
              'keep.product.name': product.name,
            },
            update: {
              $inc: { 'keep.$[outer].product.$[inner].count': -product.count },
            },
            arrayFilters: [
              { 'outer.num': num },
              { 'inner.name': product.name },
            ],
          },
        });

        // (B) 0 이하인 상품 제거: count가 0 이하가 된 상품(product)만 배열에서 추출(pull)
        bulkOps.push({
          updateOne: {
            filter: { email, 'keep.num': list.num },
            update: {
              $pull: { 'keep.$.product': { count: { $lte: 0 } } },
            },
          },
        });

        // (C) 빈 그룹 제거: 만약 product 배열이 비어버렸다면 해당 num 객체 자체를 제거
        bulkOps.push({
          updateOne: {
            filter: { email, 'keep.num': num, 'keep.product': { $size: 0 } },
            update: {
              $pull: { keep: { num: list.num } },
            },
          },
        });
      }
    }

    try {
      // 1. 주문 컬렉션을 위한 bulkWrite 작업 생성
      const orderOperations = orders.map((order: any) => ({
        updateOne: {
          filter: { orderId: order.orderId },
          update: {
            $set: {
              arrivedDate: koreaTime,
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

      const [orderResult, userResult, keepResult] = await Promise.all([
        orderColl.bulkWrite(orderOperations),
        userColl.bulkWrite(userOperations),
        userColl.bulkWrite(bulkOps as AnyBulkWriteOperation<any>[]),
      ]);

      console.log(
        `${orderResult.modifiedCount}개 주문 완료, ${userResult.modifiedCount}명 포인트 지급, ${keepResult}`,
      );

      return NextResponse.json({
        ok: true,
        result: {
          orderResult: orderResult.modifiedCount,
          userResult: userResult.modifiedCount,
          keepResult: keepResult.modifiedCount,
        },
      });
    } catch (error) {
      console.error('주문 업데이트 중 에러 발생:', error);
    }
    console.log(send, orders);
    return NextResponse.json({ ok: false, result: {} }, { status: 400 });
  }
}
