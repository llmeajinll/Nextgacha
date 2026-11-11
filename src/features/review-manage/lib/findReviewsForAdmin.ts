import { reviewColl } from '@/shared/api/mongodb';
import { maskEmail } from '@/shared/lib/maskEmail';
import { kstString } from '@/shared/lib/kstString';
import type { AdminReview } from '../model/types';

// 모든 상품의 리뷰를 최근 순으로. 작성자는 닉네임만 넘기고 이메일 원문은 내보내지 않는다
// ponytail: 리뷰 전체를 한 번에 읽어 화면에서 거름, 수천 건이 되면 필터·페이지를 서버로
export async function findReviewsForAdmin(): Promise<AdminReview[]> {
  const rows = await reviewColl
    .aggregate([
      { $unwind: '$review' },
      { $lookup: { from: 'product', localField: 'num', foreignField: 'num', as: 'p', pipeline: [{ $project: { _id: 0, title: 1, image: { $first: '$image' } } }] } },
      { $lookup: { from: 'user', localField: 'review.user', foreignField: 'email', as: 'u', pipeline: [{ $project: { _id: 0, nickname: 1 } }] } },
      { $sort: { 'review.created_at': -1 } },
      {
        $project: {
          _id: 0,
          num: 1,
          product: { $ifNull: [{ $first: '$p.title' }, ''] },
          image: { $ifNull: [{ $first: '$p.image' }, ''] },
          nickname: { $first: '$u.nickname' },
          email: '$review.user',
          rate: '$review.rate',
          content: '$review.content',
          options: { $ifNull: ['$review.list.name', []] },
          created_at: kstString('$review.created_at'),
        },
      },
    ])
    .toArray();

  return rows.map(({ nickname, email, rate, ...r }) => ({
    ...r,
    rate: Math.min(Math.max(Math.round(Number(rate) || 0), 1), 5),
    writer: nickname || maskEmail(email),
  })) as AdminReview[];
}
