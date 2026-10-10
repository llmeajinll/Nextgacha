import { NextResponse } from 'next/server';
import { qnaColl, counterColl, productColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const authSession = await auth();
  const email = authSession?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { question, secret, num: rawNum } = await req.json();
  const num = Number(rawNum);
  if (
    !Number.isInteger(num) ||
    typeof question !== 'string' ||
    question.trim().length === 0 ||
    question.length > 1000
  ) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }

  if (!(await productColl.findOne({ num }, { projection: { _id: 1 } }))) {
    return NextResponse.json({ ok: false, message: '상품을 찾을 수 없습니다.' }, { status: 404 });
  }

  // 번호만 증가시키는 카운터라 qna 저장이 실패해 번호가 비어도 무해 → 트랜잭션 불필요
  const counter = await counterColl.findOneAndUpdate(
    { qna_id: 'qna_num' },
    { $inc: { qna_num: 1 } },
    { upsert: true, returnDocument: 'after' },
  );

  const now = koreaTime();
  await qnaColl.updateOne(
    { num },
    {
      $setOnInsert: { num },
      $push: {
        qna: {
          email,
          updated_at: now,
          created_at: now,
          secret: secret === true,
          question,
          qna_num: counter?.qna_num,
          request: [],
        },
      } as any,
    },
    { upsert: true },
  );

  return NextResponse.json({ ok: true });
}
