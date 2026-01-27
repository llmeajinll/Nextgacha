import { NextResponse } from 'next/server';
import { mongodbClient, qnaColl, counterColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import { koreaTime } from '@/shared/koreaTime';

export async function POST(req: Request) {
  //   const authSession = await auth();
  //   const email = authSession?.user?.email;
  //   console.log('email :', email);

  const data = await req.json();

  console.log(data);
  const { email, question, secret, num } = data;
  console.log(email, question, secret, num);

  // const nowDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const session = mongodbClient.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const counterResult = await counterColl.findOneAndUpdate(
        { qna_id: 'qna_num' },
        { $inc: { qna_num: 1 } },
        {
          session,
          upsert: true,
          returnDocument: 'after',
        },
      );

      const nextQnaNum = counterResult?.qna_num;

      await qnaColl
        .updateOne(
          { num: Number(num) },
          {
            $setOnInsert: {
              num: Number(num),
            },

            $push: {
              qna: {
                email,
                updated_at: koreaTime,
                created_at: koreaTime,
                secret,
                question,
                qna_num: nextQnaNum,
                request: [],
              },
            } as any,
          },
          {
            session,
            upsert: true,
          },
        )
        .then((res) => {
          console.log(res);
          if (res.modifiedCount === 1) {
            return { ok: true };
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

  // const result = await reviewColl.find({ num }).sort({ create: -1 }).toArray();
  // console.log('review collection:', result);
}
