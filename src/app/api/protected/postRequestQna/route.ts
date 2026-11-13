import { NextResponse } from 'next/server';
import { qnaColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const authSession = await auth();
  const email = authSession?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { requestInput, num, qna_num } = await req.json();

  // 객체({"$gt":0})가 들어오면 연산자로 해석돼 $pull이 남의 질문까지 지움 → 정수로만 받는다
  const qnaNum = Number(qna_num);
  const productNum = Number(num);
  if (!Number.isInteger(qnaNum) || !Number.isInteger(productNum)) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }
  if (
    typeof requestInput !== 'string' ||
    requestInput.trim().length === 0 ||
    requestInput.length > 1000
  ) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }

  // 본인 질문에만 추가 질문 가능 (email 일치 조건)
  const res = await qnaColl.updateOne(
    { num: productNum, qna: { $elemMatch: { qna_num: qnaNum, email } } },
    {
      $push: {
        'qna.$.request': {
          writer: 'user',
          content: requestInput,
          created_at: koreaTime(),
        },
      } as any,
    },
  );

  if (res.modifiedCount !== 1) {
    return NextResponse.json(
      { ok: false, message: '본인이 작성한 질문에만 추가할 수 있습니다.' },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true });
}
