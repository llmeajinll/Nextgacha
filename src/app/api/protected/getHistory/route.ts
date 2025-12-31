import { NextResponse } from 'next/server';
import { orderColl, productColl, userColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  // console.log(email);
  const order = orderColl.aggregate([
    {
      $match: {
        customer: email,
      },
    },
    // {
    //   $lookup: {
    //     from: 'product',
    //     localField: 'num',
    //     foreignField: 'num',
    //     as: 'product',
    //   },
    // },
    // { $unwind: '$product' },
  ]);
  const result = await order.toArray();

  //   const response = NextResponse.json({ ok: true });
  //   response.cookies.set({
  //     name: 'userInfo',
  //     value: JSON.stringify({ email: searchParams }),
  //     httpOnly: false,
  //     path: '/',
  //   });

  //   return response;

  return NextResponse.json({ result: result, status: 200 });
}
