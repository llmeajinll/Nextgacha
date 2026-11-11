import { NextResponse } from 'next/server';
import { qnaColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { ANSWER_MAX, ANSWER_MIN } from '@/features/qna-manage/model/types';

// 관리자 답변 (proxy의 ADMIN_API_PATHS). edit면 마지막 관리자 답변을 고치고, 아니면 새 답변을 붙인다
export async function POST(req: Request) {
  const { num, qna_num, content, edit } = await req.json().catch(() => ({}));
  const text = typeof content === 'string' ? content.trim() : '';
  if (!Number.isInteger(num) || !Number.isInteger(qna_num) || text.length < ANSWER_MIN || text.length > ANSWER_MAX) {
    return NextResponse.json({ ok: false, message: `답변은 ${ANSWER_MIN}~${ANSWER_MAX}자로 적어 주세요.` }, { status: 400 });
  }

  try {
    const doc = await qnaColl.findOne({ num, 'qna.qna_num': qna_num }, { projection: { 'qna.$': 1 } });
    const request: { writer: string }[] = doc?.qna?.[0]?.request ?? [];
    if (!doc) return NextResponse.json({ ok: false, message: '문의를 찾을 수 없어요.' }, { status: 404 });

    const filter = { arrayFilters: [{ 'q.qna_num': qna_num }] };
    if (edit === true) {
      // 마지막 메시지가 관리자 답변일 때만 수정 (그 뒤에 고객이 추가 질문을 했으면 새 답변으로)
      const last = request.length - 1;
      if (request[last]?.writer !== 'master') {
        return NextResponse.json({ ok: false, message: '고칠 답변이 없어요. 새 답변으로 적어 주세요.' }, { status: 409 });
      }
      await qnaColl.updateOne({ num }, { $set: { [`qna.$[q].request.${last}.content`]: text } }, filter);
    } else {
      await qnaColl.updateOne(
        { num },
        { $push: { 'qna.$[q].request': { writer: 'master', content: text, created_at: koreaTime() } } as never },
        filter,
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('postQnaAnswer failed', num, qna_num, e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '답변을 저장하지 못했어요.' }, { status: 500 });
  }
}
