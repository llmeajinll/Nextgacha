import { NextResponse } from 'next/server';
import { qnaColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const authSession = await auth();
  const email = authSession?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { qna_num, num } = await req.json();

  // 본인 질문만 삭제 (email 일치 조건)
  const res = await qnaColl.updateOne(
    { num: Number(num), qna: { $elemMatch: { qna_num, email } } },
    { $pull: { qna: { qna_num } } as any },
  );

  if (res.modifiedCount !== 1) {
    return NextResponse.json(
      { ok: false, message: '본인이 작성한 질문만 삭제할 수 있습니다.' },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true });
}
