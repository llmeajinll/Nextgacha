import { NextResponse } from 'next/server';
import { reviewColl, orderColl, mongodbClient } from '@/lib/mongodb';
import { auth } from '@/auth';
import dayjs from 'dayjs';

export async function POST(req: Request) {
  const authSession = await auth();
  const email = authSession?.user?.email;
  console.log('email :', email);

  const info = await req.json();

  const { rate, orderId, text, purchaseDate, list } = info.data;
  console.log(rate, orderId, text, purchaseDate, list);

  const nowDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const session = mongodbClient.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. 주문 상태 업데이트
      const orderResult = await orderColl.updateOne(
        { orderId },
        { $set: { review: true } },
        { session } // 세션 전달
      );

      if (orderResult.matchedCount === 0) {
        throw new Error('주문 내역을 찾을 수 없습니다.');
      }

      // 2. 리뷰 일괄 등록 작업 생성
      const operations = list.map((val: any) => {
        const reviewInfo = {
          created_at: nowDate,
          purchaseDate,
          list: val.product,
          user: email,
          content: text,
          orderId,
          rate,
        };

        return {
          updateOne: {
            filter: { num: val.num },
            update: {
              $setOnInsert: { num: val.num },
              $push: {
                review: { $each: [reviewInfo], $position: 0 },
              },
            },
            upsert: true,
          },
        };
      });

      await reviewColl.bulkWrite(operations, { session });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('트랜잭션 실행 중 에러 발생 (롤백됨):', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    await session.endSession(); // 세션 종료
  }

  // const result = await reviewColl.find({ num }).sort({ create: -1 }).toArray();
  // console.log('review collection:', result);
}
