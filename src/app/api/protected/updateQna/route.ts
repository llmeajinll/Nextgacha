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

  const { edit, qna_num, num } = await req.json();
  if (typeof edit !== 'string' || edit.trim().length === 0 || edit.length > 1000) {
    return NextResponse.json({ ok: false, message: 'invalid request' }, { status: 400 });
  }

  // 본인 질문만 수정 (email 일치 조건). $는 매칭된 qna 배열 요소를 가리킴
  const res = await qnaColl.updateOne(
    { num: Number(num), qna: { $elemMatch: { qna_num, email } } },
    {
      $set: {
        'qna.$.question': edit,
        'qna.$.updated_at': koreaTime(),
      },
    },
  );

  // 같은 내용으로 수정하면 modifiedCount가 0이므로 matchedCount로 판단
  if (res.matchedCount !== 1) {
    return NextResponse.json(
      { ok: false, message: '본인이 작성한 질문만 수정할 수 있습니다.' },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true });
}
