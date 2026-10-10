import { NextResponse } from 'next/server';
import { reviewColl, orderColl, mongodbClient } from '@/shared/api/mongodb';
import { auth } from '@/auth';
import { koreaTime } from '@/shared/lib/koreaTime';

export async function POST(req: Request) {
  const authSession = await auth();
  const email = authSession?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const info = await req.json();
  const { rate, orderId, text } = info.data ?? {};

  if (
    !Number.isInteger(rate) ||
    rate < 1 ||
    rate > 5 ||
    typeof orderId !== 'string' ||
    typeof text !== 'string' ||
    text.length > 1000
  ) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }

  const session = mongodbClient.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. 본인 주문 + 배송 완료 + 아직 리뷰 안 쓴 주문만 (중복 리뷰 방지)
      const order = await orderColl.findOneAndUpdate(
        { orderId, email, status: '배송 완료', review: false },
        { $set: { review: true } },
        { session },
      );

      if (!order) {
        throw new Error('리뷰를 작성할 수 있는 주문이 아닙니다.');
      }

      // 2. 리뷰 일괄 등록 (상품 목록/구매일은 클라이언트 값이 아닌 주문 문서 기준)
      const operations = order.list.map((val: any) => {
        const reviewInfo = {
          created_at: koreaTime(),
          purchaseDate: order.created_at,
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
    return NextResponse.json({ ok: false }, { status: 400 });
  } finally {
    await session.endSession();
  }
}
