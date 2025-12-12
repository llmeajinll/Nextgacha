import { userColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();
  console.log('data : ', data, 'email : ', session?.user?.email);
  // 갯수 증가할 때
  if (data.preset === 'increase') {
    const result = await userColl
      .updateOne(
        {
          email: data.email,
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
    // if (result.acknowledged === true) {
    //   revalidateTag('cart', 'default');
    //   console.log('revalidated cart tag after increase');
    // }
    return NextResponse.json({ result }, { status: 200 });
  }
  // 갯수 감소할 때
  else if (data.preset === 'decrease') {
    const result = await userColl
      .updateOne(
        {
          email: data.email,
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
        console.log('mongodb getUser res:', res);
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
    const result = await userColl
      .updateOne(
        {
          email: data.email,
          'cart.product.code': data.code,
        },
        {
          $pull: {
            'cart.$.product': { code: data.code },
          },
        } as any
      )
      .then((res) => {
        console.log('mongodb getUser res:', res);
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
