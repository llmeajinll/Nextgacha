import { userColl } from '@/shared/api/mongodb';
import { isAdminEmail } from '@/shared/lib/isAdmin';
import { kstString } from '@/shared/lib/kstString';
import type { AdminUser } from '../model/types';

// 회원 목록 + 환불을 뺀 주문 수·결제 합계 (최근 가입 순)
// ponytail: 회원 전체를 한 번에 읽어 화면에서 거름, 수천 명이 되면 검색·페이지를 서버로
export async function findUsersForAdmin(): Promise<AdminUser[]> {
  const rows = await userColl
    .aggregate([
      {
        $lookup: {
          from: 'order',
          let: { e: '$email' },
          pipeline: [
            { $match: { $expr: { $eq: ['$email', '$$e'] }, status: { $ne: '환불' } } },
            { $group: { _id: null, n: { $sum: 1 }, spent: { $sum: '$totalPrice' } } },
          ],
          as: 'o',
        },
      },
      { $sort: { created_at: -1 } },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          nickname: { $ifNull: ['$nickname', ''] },
          email: 1,
          point: { $ifNull: ['$point', 0] },
          created_at: kstString('$created_at'),
          orders: { $ifNull: [{ $first: '$o.n' }, 0] },
          spent: { $ifNull: [{ $first: '$o.spent' }, 0] },
        },
      },
    ])
    .toArray();

  return rows.map((u) => ({ ...u, admin: isAdminEmail(u.email) }) as AdminUser);
}
