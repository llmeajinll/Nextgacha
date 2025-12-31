import { cartColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();
  console.log('data : ', data, 'email : ', session?.user?.email);
  // 갯수 증가할 때
  if (data.preset === 'increase') {
    const result = await cartColl
      .updateOne(
        {
          user: data.email,
          'cart.product.code': data.code,
        },
        {
          $inc: { 'cart.$[].product.$[p].count': 1 },
        },
        {
          arrayFilters: [{ 'p.code': data.code }],
        }
      )
      .then((res) => {
        // console.log('mongodb getUser res:', res);
        return res;
      })
      .catch((err) => {
        console.log('mongodb getUser error:', err);
        return { acknowledged: false, modifiedCount: 0 };
      });

    return NextResponse.json({ result }, { status: 200 });
  }
  // 갯수 감소할 때
  else if (data.preset === 'decrease') {
    const result = await cartColl
      .updateOne(
        {
          user: data.email,
          'cart.product.code': data.code,
        },
        {
          $inc: { 'cart.$[].product.$[p].count': -1 },
        },
        {
          arrayFilters: [{ 'p.code': data.code }],
        }
      )
      .then((res) => {
        // console.log('mongodb getUser res:', res);
        return res;
      })
      .catch((err) => {
        console.log('mongodb getUser error:', err);
        return { acknowledged: false, modifiedCount: 0 };
      });
    // if (result.acknowledged === true && result.modifiedCount > 0) {
    //   revalidateTag('cart', 'default');
    //   console.log('revalidated cart tag after decrease');
    // }

    return NextResponse.json({ result }, { status: 200 });
  }
  // 상품 삭제할 때
  else if (data.preset === 'erase') {
    const result = await cartColl
      .updateOne(
        {
          user: data.email,
          'cart.product.code': data.code,
        },
        [
          {
            // 1️⃣ product 안에서 code 제거
            $set: {
              cart: {
                $map: {
                  input: '$cart',
                  as: 'c',
                  in: {
                    num: '$$c.num',
                    product: {
                      $filter: {
                        input: '$$c.product',
                        as: 'p',
                        cond: { $ne: ['$$p.code', data.code] },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            // 2️⃣ product가 빈 cart 제거
            $set: {
              cart: {
                $filter: {
                  input: '$cart',
                  as: 'c',
                  cond: { $gt: [{ $size: '$$c.product' }, 0] },
                },
              },
            },
          },
        ]
        // {
        //   $pull: {
        //     'cart.$[].product': { code: data.code },
        //   },
        // } as any
      )
      .then((res) => {
        // console.log('mongodb getUser res:', res);
        return res;
      })
      .catch((err) => {
        console.log('mongodb getUser error:', err);
        return { acknowledged: false, modifiedCount: 0 };
      });
    // if (result.acknowledged === true && result.modifiedCount > 0) {
    //   revalidateTag('cart', 'default');
    //   console.log('revalidated cart tag after decrease');
    // }
    return NextResponse.json({ result }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid preset' }, { status: 400 });
  }

  //   revalidateTag('cart', 'default');
  // return NextResponse.json({ result }, { status: 200 });

  //   if (
  //     revalidateTag &&
  //     result.acknowledged === true &&
  //     (result.modifiedCount > 0 || data.preset === 'erase')
  //   ) {
  //     revalidateTag('cart', 'default');
  //     console.log(`revalidated cart tag after ${data.preset}`);
  //   }
  //   return NextResponse.json({ result }, { status: 200 });
}
