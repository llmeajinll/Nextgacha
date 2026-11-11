import { ObjectId } from 'mongodb';
import { cartColl, orderColl, productColl, qnaColl, reviewColl, userColl } from '@/shared/api/mongodb';
import { kstString } from '@/shared/lib/kstString';
import type { AdminUserDetail } from '../model/types';

type Line = { num: number; product?: { name: string; count: number }[] };

// 고른 회원 한 명의 상세. id는 호출하는 쪽에서 ObjectId.isValid로 확인한 값
export async function findUserDetail(id: string): Promise<AdminUserDetail | null> {
  const user = await userColl.findOne(
    { _id: new ObjectId(id) },
    { projection: { email: 1, address: 1, like: 1, keep: 1 } },
  );
  if (!user?.email) return null;
  const email: string = user.email;

  const [cart, recent, [reviews], [qna]] = await Promise.all([
    cartColl.findOne({ user: email }, { projection: { cart: 1 } }),
    orderColl
      .aggregate([
        { $match: { email } },
        { $sort: { _id: -1 } },
        { $limit: 3 },
        { $project: { _id: 0, orderId: 1, status: 1, totalPrice: 1, created_at: kstString('$created_at') } },
      ])
      .toArray(),
    reviewColl.aggregate([{ $unwind: '$review' }, { $match: { 'review.user': email } }, { $count: 'n' }]).toArray(),
    qnaColl.aggregate([{ $unwind: '$qna' }, { $match: { 'qna.email': email } }, { $count: 'n' }]).toArray(),
  ]);

  // 장바구니 + 진행 중 주문(user.keep)을 상품·옵션별로 합침 (한도 검사와 같은 기준)
  const sum = new Map<string, { num: number; name: string; count: number }>();
  for (const line of [...((user.keep ?? []) as Line[]), ...((cart?.cart ?? []) as Line[])]) {
    for (const p of line.product ?? []) {
      const key = `${line.num}\u0000${p.name}`;
      const cur = sum.get(key) ?? { num: line.num, name: p.name, count: 0 };
      cur.count += Number(p.count) || 0;
      sum.set(key, cur);
    }
  }
  const nums = [...new Set([...sum.values()].map((k) => k.num))];
  const titles = new Map(
    (await productColl.find({ num: { $in: nums } }, { projection: { _id: 0, num: 1, title: 1 } }).toArray()).map((p) => [
      p.num,
      p.title as string,
    ]),
  );

  return JSON.parse(
    JSON.stringify({
      address: user.address ?? '',
      reviews: reviews?.n ?? 0,
      qna: qna?.n ?? 0,
      likes: (user.like ?? []).length,
      keep: [...sum.values()]
        .filter((k) => k.count > 0)
        .map((k) => ({ ...k, title: titles.get(k.num) ?? `${k.num}번 상품` }))
        .sort((a, b) => b.count - a.count),
      recent,
    }),
  );
}
