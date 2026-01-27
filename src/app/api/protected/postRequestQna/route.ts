import { NextResponse } from 'next/server';
import { mongodbClient, qnaColl } from '@/lib/mongodb';
import { koreaTime } from '@/shared/koreaTime';

import dayjs from 'dayjs';

export async function POST(req: Request) {
  const data = await req.json();

  console.log(data);
  const { requestInput, num, qna_num } = data;
  console.log(requestInput, num, qna_num);

  const session = mongodbClient.startSession();

  try {
    // const nowDate = dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss');
    const result = await session.withTransaction(async () => {
      await qnaColl
        .updateOne(
          { num: Number(num), 'qna.qna_num': qna_num },
          {
            $push: {
              'qna.$.request': {
                writer: 'user',
                content: requestInput,
                created_at: koreaTime,
              },
            } as any,
          },
          {
            session,
          },
        )
        .then((res) => {
          console.log(res);
          if (res.modifiedCount === 1) {
            return { ok: true, message: 'success' };
          } else {
            return { ok: false, message: 'fail update' };
          }
        })
        .catch((err) => {
          console.log(err);
          return { ok: false, message: 'error' };
        });
    });
    return NextResponse.json({ result });
  } catch (error) {
    console.error('트랜잭션 실행 중 에러 발생 (롤백됨):', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    await session.endSession(); // 세션 종료
  }
}
