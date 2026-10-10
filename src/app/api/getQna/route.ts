import { NextResponse } from 'next/server';
import { qnaColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';
import { isAdminEmail } from '@/shared/lib/isAdmin';
import { maskEmail } from '@/shared/lib/maskEmail';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const num = Number(searchParams.get('num'));

  if (!Number.isInteger(num) || num <= 0) {
    return NextResponse.json({ ok: false, error: 'num is required' }, { status: 400 });
  }

  const session = await auth();
  const viewer = session?.user?.email;
  const isAdmin = isAdminEmail(viewer);

  const [data] = await qnaColl
    .aggregate([
      { $match: { num } },
      {
        $project: {
          qna: {
            $sortArray: {
              input: '$qna',
              sortBy: { created_at: -1 },
            },
          },
        },
      },
    ])
    .toArray();

  // 이메일 원문은 내보내지 않는다. 비밀글은 작성자/관리자에게만 내용 공개
  const qna = (data?.qna ?? []).map(({ email, ...item }: any) => {
    const isMine = !!viewer && email === viewer;
    const hidden = item.secret === true && !isMine && !isAdmin;
    return {
      ...item,
      email: maskEmail(email),
      isMine,
      ...(hidden && { question: '', request: [] }),
    };
  });

  return NextResponse.json({ result: { ...data, qna }, ok: true });
}
