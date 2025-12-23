import { NextResponse } from 'next/server';
import { userColl, cartColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('data : ', data);
  const { num, updatedArray } = data;

  const session = await auth();
  const email = session?.user?.email;

  console.log('email, num, updatedArray : ', email, num, updatedArray);

  try {
    for (const newItem of updatedArray) {
      // 1. 해당 num과 code가 모두 존재하는지 확인하여 count만 올림
      console.log('newItem : ', newItem);
      const res1 = await cartColl.updateOne(
        {
          user: email,
          'cart.num': num,
          'cart.product.code': newItem.code,
        },
        {
          $inc: { 'cart.$[outer].product.$[inner].count': newItem.count },
        },
        {
          arrayFilters: [{ 'outer.num': num }, { 'inner.code': newItem.code }],
        }
      );
      console.log('res1 : ', res1);

      // 2. 만약 업데이트된 문서가 없다면 (num이 없거나, code가 없는 경우)
      if (res1.matchedCount === 0) {
        console.log('num은 있는데 code만 없는 경우');
        // 2-1. num은 있는데 code만 없는 경우를 체크하여 product 배열에 추가
        const res2 = await cartColl.updateOne(
          {
            user: email,
            'cart.num': num,
          },
          {
            $push: { 'cart.$.product': newItem },
          }
        );
        console.log('res2 : ', res2);

        // 2-2. num 자체가 없는 경우 (완전 새로운 num 항목을 cart 배열에 추가)
        if (res2.matchedCount === 0) {
          console.log('완전 새로운 num 항목을 cart 배열에 추가');
          await cartColl.updateOne(
            { user: email },
            {
              $push: {
                cart: {
                  num: num,
                  product: [newItem],
                },
              } as any,
            }
          );
        }
      }
    }
    console.log('모든 아이템이 성공적으로 반영되었습니다.');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('데이터베이스 업데이트 중 오류 발생:', error);
    return NextResponse.json({ ok: false });
  }
}

//   const result = await userColl.updateOne(
//     { email: data.email, 'cart.num': data.num },
//     { $set: { 'cart.$.product': data.updatedArray } }
//   );

// console.log('product : ', product);

//   return NextResponse.json({ ok: true });
