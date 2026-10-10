import { NextResponse } from 'next/server';
import { cartColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';
import { checkCartLimit } from '@/features/purchase/lib/checkCartLimit';

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { num, updatedArray } = await req.json();

  const limitError = await checkCartLimit(email, num, updatedArray);
  if (limitError) {
    return NextResponse.json({ ok: false, message: limitError }, { status: 400 });
  }

  try {
    await cartColl.updateOne(
      { user: email },
      { $setOnInsert: { user: email, cart: [] } },
      { upsert: true }
    );

    for (const { name, count } of updatedArray) {
      // 1. 해당 num과 name이 모두 존재하면 count만 올림
      const res1 = await cartColl.updateOne(
        {
          user: email,
          'cart.num': num,
          'cart.product.name': name,
        },
        {
          $inc: { 'cart.$[outer].product.$[inner].count': count },
        },
        {
          arrayFilters: [{ 'outer.num': num }, { 'inner.name': name }],
        }
      );

      // 2. 만약 업데이트된 문서가 없다면 (num이 없거나, name이 없는 경우)
      if (res1.matchedCount === 0) {
        // 2-1. num은 있는데 name만 없는 경우 product 배열에 추가
        const res2 = await cartColl.updateOne(
          {
            user: email,
            'cart.num': num,
          },
          {
            $push: { 'cart.$.product': { name, count } } as any,
          }
        );

        // 2-2. num 자체가 없는 경우 (완전 새로운 num 항목을 cart 배열에 추가)
        if (res2.matchedCount === 0) {
          await cartColl.updateOne(
            { user: email },
            {
              $push: {
                cart: {
                  num: num,
                  product: [{ name, count }],
                },
              } as any,
            }
          );
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('데이터베이스 업데이트 중 오류 발생:', error);
    return NextResponse.json({ ok: false });
  }
}
