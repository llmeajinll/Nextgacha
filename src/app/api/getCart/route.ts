'use server';

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { userColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  //   const session = await auth();
  //   console.log('email : ', session?.user);

  //   if (!session?.user?.email) {
  //     return NextResponse.json(
  //       { ok: false, error: 'Unauthorized' },
  //       { status: 202 }
  //     );
  //   }
  const { searchParams } = new URL(req.url);
  console.log('email:', searchParams);
  const email = searchParams.get('email') || '';

  const pipeline = [
    {
      //   $match: { email: session?.user?.email },
      $match: { email: email },
    },
    {
      $unwind: '$cart',
    },
    {
      $lookup: {
        from: 'product',
        localField: 'cart.num',
        foreignField: 'num',
        as: 'productInfo',
      },
    },
    {
      $unwind: {
        path: '$productInfo',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,
        num: '$cart.num',
        product: '$cart.product',
        list: '$productInfo.list',
        price: '$productInfo.price',
        image: '$productInfo.image',
        title: '$productInfo.title',
      },
    },
  ];

  const cart = await userColl.aggregate(pipeline).toArray();
  console.log('aggregated cart : ', cart);

  return NextResponse.json({ ok: true, data: cart }, { status: 200 });
}
