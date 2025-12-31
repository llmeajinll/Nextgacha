import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { userColl, cartColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';

  // const session = await auth();
  // const email = session?.user?.email;

  // console.log('auth email : ', email);

  const pipeline = [
    {
      //   $match: { email: session?.user?.email },
      $match: { user: email },
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

  const data = await cartColl.aggregate(pipeline).toArray();
  // console.log('aggregated cart : ', data);

  return NextResponse.json({ ok: true, data }, { status: 200 });
}
