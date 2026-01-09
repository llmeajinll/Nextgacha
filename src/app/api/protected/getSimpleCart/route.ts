import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { userColl, cartColl, productColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const numStr = searchParams.get('num') || '';
  const num = Number(numStr);

  console.log(num, typeof num);

  const session = await auth();
  const email = session?.user?.email;

  if (!numStr) {
    return NextResponse.json({ error: 'No Param' }, { status: 500 });
  }

  try {
    const result = await productColl
      .aggregate([
        // 1. 상품 먼저 찾기
        { $match: { num: num } },

        // 2. 장바구니 조인
        {
          $lookup: {
            from: 'cart',
            let: { targetNum: '$num', userEmail: email }, // 2. email을 변수로 전달
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$user', '$$userEmail'] }, // 3. 필드명이 'user'인지 'email'인지 확인!
                },
              },
              { $unwind: '$cart' },
              { $match: { $expr: { $eq: ['$cart.num', '$$targetNum'] } } },
              { $replaceRoot: { newRoot: '$cart' } },
            ],
            as: 'cart',
          },
        },
        { $unwind: { path: '$cart', preserveNullAndEmptyArrays: true } },

        // 3. 보관함 조인
        {
          $lookup: {
            from: 'user',
            let: { targetNum: '$num', userEmail: email },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$email', '$$userEmail'] },
                },
              },
              { $unwind: '$keep' },
              { $match: { $expr: { $eq: ['$keep.num', '$$targetNum'] } } },
              { $replaceRoot: { newRoot: '$keep' } },
            ],
            as: 'keep',
          },
        },
        { $unwind: { path: '$keep', preserveNullAndEmptyArrays: true } },

        // 4. 구조 정리
        {
          $project: {
            _id: 0,
            num: 1,
            stock: { list: '$list', price: '$price', title: '$title' },
            cart: {
              $ifNull: ['$cart.product', []],
            },
            keep: { $ifNull: ['$keep.product', []] },
          },
        },
        {
          $project: {
            'stock.cart': 0,
            'stock.keep': 0,
          },
        },
        { $limit: 1 },
      ])
      .toArray();

    console.log('getSimpleCart : ', result[0]);

    return NextResponse.json({ ok: true, result: result[0] || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
