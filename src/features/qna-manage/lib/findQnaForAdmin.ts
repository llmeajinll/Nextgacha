import { qnaColl } from '@/shared/api/mongodb';
import { maskEmail } from '@/shared/lib/maskEmail';
import { kstString } from '@/shared/lib/kstString';
import type { AdminQna } from '../model/types';

// 모든 상품의 문의를 최근 순으로. 작성자는 닉네임만 넘기고 이메일 원문은 내보내지 않는다
// ponytail: 문의 전체를 한 번에 읽음, 수천 건이 되면 상태 필터·페이지를 서버로
export async function findQnaForAdmin(): Promise<AdminQna[]> {
  const rows = await qnaColl
    .aggregate([
      { $unwind: '$qna' },
      { $lookup: { from: 'product', localField: 'num', foreignField: 'num', as: 'p', pipeline: [{ $project: { _id: 0, title: 1 } }] } },
      { $lookup: { from: 'user', localField: 'qna.email', foreignField: 'email', as: 'u', pipeline: [{ $project: { _id: 0, nickname: 1 } }] } },
      { $sort: { 'qna.created_at': -1 } },
      {
        $project: {
          _id: 0,
          num: 1,
          product: { $ifNull: [{ $first: '$p.title' }, ''] },
          nickname: { $first: '$u.nickname' },
          email: '$qna.email',
          qna_num: '$qna.qna_num',
          question: '$qna.question',
          secret: { $eq: ['$qna.secret', true] },
          created_at: kstString('$qna.created_at'),
          request: {
            $map: {
              input: { $ifNull: ['$qna.request', []] },
              as: 'm',
              in: { writer: '$$m.writer', content: '$$m.content', created_at: kstString('$$m.created_at') },
            },
          },
        },
      },
    ])
    .toArray();

  return rows.map(({ nickname, email, ...q }) => ({ ...q, writer: nickname || maskEmail(email) }) as AdminQna);
}
